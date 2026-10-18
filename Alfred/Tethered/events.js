var AlfredEventUI = (function () {
    function uuid() { return ObjC.unwrap($.NSUUID.UUID.UUIDString); }
    function url(path, values) {
        return "tethered://control" + path + "?" + Object.keys(values).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(values[key]);
        }).join("&");
    }
    function request(path, values, key) {
        if (!running()) throw new Error("Open the updated Tethered app first.");
        const id = uuid();
        values = Object.assign({}, values, {request: id});
        send(url(path, values));
        const deadline = Date.now() + (values.operation === "list" || path === "/companion-sync/toggle" ? 12000 : 120000);
        while (Date.now() < deadline) {
            let response;
            try { response = stored(key); } catch (_) {}
            if (response && response.request === id && typeof response.success === "boolean" && typeof response.message === "string") {
                if (!response.success) throw new Error(response.message);
                return response;
            }
            $.NSThread.sleepForTimeInterval(0.15);
        }
        throw new Error("No confirmation from Tethered. Update the app and check its settings before retrying; the request may have succeeded.");
    }
    function hint(title, subtitle, autocomplete) {
        const row = {title: title, subtitle: subtitle || "", valid: false, icon: {path: "icon.png"}};
        if (autocomplete) row.autocomplete = autocomplete;
        return row;
    }
    function action(title, subtitle, value) {
        return {title: title, subtitle: subtitle, arg: JSON.stringify(value), valid: true, icon: {path: "icon.png"}};
    }
    function cache(events) {
        const defaults = $.NSUserDefaults.alloc.initWithSuiteName("com.Tumerit.Tethered.alfred");
        if (events) {
            defaults.setObjectForKey($(JSON.stringify(events)), $("eventCache"));
            defaults.synchronize;
            return events;
        }
        defaults.synchronize;
        const text = defaults.stringForKey($("eventCache"));
        return text && !text.isNil() ? JSON.parse(ObjC.unwrap(text)) : [];
    }
    function fetchEvents() {
        const events = request("/events/manage", {operation: "list"}, "raycastEventResult").events;
        if (!Array.isArray(events) || !events.every(function (event) {
            return event && typeof event.id === "string" && typeof event.action === "string" &&
                typeof event.enabled === "boolean" && typeof event.repeating === "boolean" &&
                typeof event.date === "number" && Number.isFinite(event.date) &&
                (event.source === "app" || event.source === "power");
        })) throw new Error("Unexpected event data. Update Tethered and the workflow together.");
        return cache(events.sort(function (a, b) { return Number(b.enabled) - Number(a.enabled) || a.date - b.date; }));
    }
    function dateLabel(event) { return new Date(event.date * 1000).toLocaleString(); }
    function expression(event) {
        const value = AlfredEvents.valuesForEvent(event);
        const names = {modeLow: "low power", modeAuto: "auto power", modeHigh: "high power", topupOn: "topup on", topupOff: "topup off", caffeinateOn: "start caffeinate", caffeinateOff: "stop caffeinate", poweron: "power on", wakeorpoweron: "wake or power on"};
        let text = names[event.action] || event.action;
        if (event.action === "brightness" || event.action === "fans") text += " " + (value.mode === "fixed" ? value.percent + "%" : "system");
        const date = new Date(event.date * 1000);
        function pad(number) { return String(number).padStart(2, "0"); }
        text += event.repeating ? " every " + AlfredEvents.days.filter(function (day) { return value.weekdays.indexOf(day[0]) >= 0; }).map(function (day) { return day[1]; }).join(" and ") + " at " + value.time :
            " " + date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " at " + pad(date.getHours()) + ":" + pad(date.getMinutes());
        if (Number(value.duration) > 0) text += " for " + value.duration + " minutes";
        if (Number(value.wait) > 0) text += " wait for ac " + value.wait + " minutes";
        return text;
    }
    function find(id) {
        const event = cache().find(function (item) { return item.id === id; });
        if (!event) throw new Error("Refresh tethered events before selecting this event.");
        return event;
    }
    function menu(query) {
        const parts = query.trim().split(/\s+/);
        const mode = parts.shift().toLowerCase();
        if (mode === "events" || mode === "next") {
            const events = fetchEvents();
            const filter = parts.join(" ").toLowerCase();
            const candidates = events.filter(function (event) {
                return (mode !== "next" || (event.enabled && event.date * 1000 > Date.now())) &&
                    (!filter || (AlfredEvents.actionTitle(event.action) + " " + dateLabel(event)).toLowerCase().indexOf(filter) >= 0);
            });
            const rows = (mode === "next" ? candidates.slice(0, 1) : candidates).map(function (event) {
                return hint((event.enabled ? "" : "Disabled: ") + AlfredEvents.actionTitle(event.action),
                    (event.repeating ? "Repeating · " : "One-time · ") + (event.enabled ? dateLabel(event) : "No upcoming run"), "event " + encodeURIComponent(event.id));
            });
            if (!rows.length) rows.push(hint(mode === "next" ? "No upcoming events" : "No matching events", "Type tethered quick to create an event"));
            rows.push(hint("Create Event", "Preview a supported schedule as you type", "quick "));
            return rows;
        }
        if (mode === "event" || mode === "delete") {
            const event = find(decodeURIComponent(parts.join(" ")));
            if (mode === "delete") return [action("Confirm Delete: " + AlfredEvents.actionTitle(event.action), "Permanently removes this scheduled event", {operation: "event-delete", id: event.id})];
            const rows = [hint("Edit: " + AlfredEvents.actionTitle(event.action), dateLabel(event), "edit " + encodeURIComponent(event.id) + " " + expression(event))];
            if (event.repeating) rows.push(action(event.enabled ? "Disable Repeating Event" : "Enable Repeating Event", "Keep the event’s settings", {operation: "event-toggle", id: event.id, enabled: !event.enabled}));
            rows.push(hint("Delete Event…", "Review before deleting", "delete " + encodeURIComponent(event.id)));
            rows.push(hint("Back to Events", "Refresh from Tethered", "events"));
            return rows;
        }
        if (["quick", "schedule", "repeat", "edit"].indexOf(mode) >= 0) {
            let original;
            if (mode === "edit") original = find(decodeURIComponent(parts.shift() || ""));
            if (!parts.length) return [hint("Type an Event", "Examples: sleep in 30 minutes · low power weekdays at 9am for 2 hours", query.replace(/\s*$/, " "))];
            let text = parts.join(" ");
            let replace = false;
            if (/\s+replace$/i.test(text)) { replace = true; text = text.replace(/\s+replace$/i, ""); }
            const parsed = AlfredEvents.parseEvent(text);
            if ((mode === "repeat" && !parsed.repeating) || (mode === "schedule" && parsed.repeating)) throw new Error("Use repeat for weekly events and schedule for one-time events.");
            if (original && (parsed.repeating !== original.repeating || AlfredEvents.powerActions.has(parsed.values.action) !== (original.source === "power"))) throw new Error("Keep the original event’s source and one-time/repeating type when editing.");
            parsed.values.replace = replace;
            const values = AlfredEvents.eventParameters(parsed.values, parsed.repeating);
            if (original) values.id = original.id;
            const rows = [action(original ? "Save Changes: " + AlfredEvents.actionTitle(parsed.values.action) : "Create: " + AlfredEvents.actionTitle(parsed.values.action),
                parsed.nextDate.toLocaleString() + (original && !original.enabled ? " · Remains disabled" : "") + (replace ? " · Replace conflicting power event" : ""), {operation: "event-save", values: values})];
            AlfredEvents.eventSummary(parsed.values, parsed.repeating).replace(/\*\*/g, "").split("\n\n").forEach(function (line) { rows.push(hint(line)); });
            return rows;
        }
        return [hint("Unknown event command", "Try events, next, quick, schedule, or repeat")];
    }
    function execute(value) {
        if (value.operation === "companion-toggle") return request("/companion-sync/toggle", {}, "raycastCompanionSyncResult").message;
        if (value.operation === "event-save") {
            if (!value.values || typeof value.values.action !== "string") throw new Error("Invalid event request.");
            if (value.values.date && Number(value.values.date) * 1000 <= Date.now()) throw new Error("Choose a future date and time.");
            return request("/events/create", value.values, "raycastEventResult").message;
        }
        if (["event-delete", "event-toggle"].indexOf(value.operation) >= 0 && typeof value.id === "string") {
            const values = {operation: value.operation === "event-delete" ? "delete" : "toggle", id: value.id};
            if (value.operation === "event-toggle") values.enabled = String(value.enabled === true);
            request("/events/manage", values, "raycastEventResult");
            return value.operation === "event-delete" ? "Event deleted." : value.enabled ? "Repeating event enabled." : "Repeating event disabled.";
        }
        throw new Error("Invalid event action.");
    }
    return {menu: menu, execute: execute};
})();
