var AlfredEvents = (function () {
const actions = [
    ["sleep", "Sleep"],
    ["wake", "Wake"],
    ["shutdown", "Shut Down"],
    ["poweron", "Power On"],
    ["wakeorpoweron", "Wake or Power On"],
    ["modeLow", "Low Power"],
    ["modeAuto", "Auto Power"],
    ["modeHigh", "High Power"],
    ["topupOn", "Enable Topup"],
    ["topupOff", "Disable Topup"],
    ["caffeinateOn", "Start Caffeinate"],
    ["caffeinateOff", "Stop Caffeinate"],
    ["brightness", "Brightness"],
    ["fans", "Fans"],
];
const days = [
    ["M", "Monday"],
    ["T", "Tuesday"],
    ["W", "Wednesday"],
    ["R", "Thursday"],
    ["F", "Friday"],
    ["S", "Saturday"],
    ["U", "Sunday"],
];
const powerActions = new Set(["sleep", "wake", "shutdown", "poweron", "wakeorpoweron"]);
const durationActions = new Set(["modeLow", "modeAuto", "modeHigh", "caffeinateOn", "brightness", "fans"]);
const actionTitle = (action) => { var _a, _b; return (_b = (_a = actions.find(([value]) => value === action)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : action; };
function seconds(value, title) {
    if (!(value === null || value === void 0 ? void 0 : value.trim()))
        return "0";
    const minutes = Number(value);
    if (!Number.isFinite(minutes) || minutes < 0 || minutes > 525600)
        throw new Error(`${title} must be between 0 and 525600 minutes.`);
    return String(minutes * 60);
}
function eventParameters(values, repeating, now = Date.now()) {
    var _a, _b, _c, _d, _e;
    const query = { action: values.action };
    if (!actions.some(([action]) => action === values.action))
        throw new Error("Choose an event action.");
    if (repeating) {
        if (!((_a = values.weekdays) === null || _a === void 0 ? void 0 : _a.length) || values.weekdays.some((value) => !days.some(([day]) => day === value)))
            throw new Error("Select at least one weekday.");
        const time = (_c = (_b = values.time) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : "";
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))
            throw new Error("Use HH:MM in 24-hour time, such as 09:30.");
        query.weekdays = days
            .filter(([day]) => { var _a; return (_a = values.weekdays) === null || _a === void 0 ? void 0 : _a.includes(day); })
            .map(([day]) => day)
            .join("");
        query.time = `${time}:00`;
        if (powerActions.has(values.action) && values.replace)
            query.replace = "true";
    }
    else {
        if (!values.date || !Number.isFinite(values.date.getTime()) || values.date.getTime() <= now)
            throw new Error("Choose a future date and time.");
        query.date = String(values.date.getTime() / 1000);
    }
    if (durationActions.has(values.action))
        query.duration = seconds(values.duration, "Duration");
    if (values.action === "topupOn")
        query.wait = seconds(values.wait, "Wait for AC");
    if (values.action === "brightness" || values.action === "fans") {
        query.mode = (_d = values.mode) !== null && _d !== void 0 ? _d : "system";
        const percent = query.mode === "fixed" ? Number(values.percent) : 50;
        if (!Number.isInteger(percent) ||
            percent < 0 ||
            percent > 100 ||
            (query.mode === "fixed" && !((_e = values.percent) === null || _e === void 0 ? void 0 : _e.trim())))
            throw new Error("Enter a percentage from 0 to 100.");
        query.percent = String(percent);
    }
    return query;
}
function nextOccurrence(weekdays, time, now = new Date()) {
    const [hour, minute] = time.split(":").map(Number);
    const tokens = ["U", "M", "T", "W", "R", "F", "S"];
    for (let offset = 0; offset <= 7; offset++) {
        const candidate = new Date(now);
        candidate.setDate(candidate.getDate() + offset);
        candidate.setHours(hour, minute, 0, 0);
        if (Number.isFinite(hour) && candidate.getHours() !== hour)
            candidate.setMinutes(0, 0, 0);
        if (weekdays.includes(tokens[candidate.getDay()]) && candidate > now)
            return candidate;
    }
}
function eventSummary(values, repeating, now = new Date()) {
    var _a, _b;
    const date = repeating ? nextOccurrence((_a = values.weekdays) !== null && _a !== void 0 ? _a : [], (_b = values.time) !== null && _b !== void 0 ? _b : "", now) : values.date;
    const lines = [
        `**${actionTitle(values.action)}**`,
        repeating
            ? `Repeats: ${days
                .filter(([day]) => { var _a; return (_a = values.weekdays) === null || _a === void 0 ? void 0 : _a.includes(day); })
                .map(([, name]) => name)
                .join(", ")} at ${values.time || "…"}`
            : "One-time event",
        `Next: ${date && Number.isFinite(date.getTime()) ? date.toLocaleString() : "Choose a valid date and time"}`,
    ];
    if ((values.action === "brightness" || values.action === "fans") && values.mode)
        lines.push(`Control: ${values.mode === "fixed" ? `${values.percent || "…"}%` : "System"}`);
    if (durationActions.has(values.action))
        lines.push(`Duration: ${Number(values.duration) > 0 ? `${values.duration} minutes` : "Until stopped"}`);
    if (values.action === "topupOn")
        lines.push(`Wait for AC: ${Number(values.wait) > 0 ? `${values.wait} minutes` : "Run only if connected"}`);
    lines.push(`Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`);
    return lines.join("\n\n");
}
function valuesForEvent(event) {
    var _a, _b, _c, _d, _e, _f;
    return {
        action: event.action,
        date: new Date(event.date * 1000),
        weekdays: (_a = event.weekdays) === null || _a === void 0 ? void 0 : _a.split(""),
        time: (_b = event.time) === null || _b === void 0 ? void 0 : _b.slice(0, 5),
        duration: String(((_c = event.duration) !== null && _c !== void 0 ? _c : 0) / 60),
        wait: String(((_d = event.wait) !== null && _d !== void 0 ? _d : 0) / 60),
        mode: (_e = event.mode) !== null && _e !== void 0 ? _e : "system",
        percent: String((_f = event.percent) !== null && _f !== void 0 ? _f : 50),
    };
}
const aliases = [
    [/^(?:wake or power on|wakeorpoweron)\b/, "wakeorpoweron"],
    [/^(?:shut down|shutdown)\b/, "shutdown"],
    [/^power on\b/, "poweron"],
    [/^(?:low power mode|low power)\b/, "modeLow"],
    [/^(?:auto power mode|auto power)\b/, "modeAuto"],
    [/^(?:high power mode|high power)\b/, "modeHigh"],
    [/^(?:disable topup|topup off|stop topup)\b/, "topupOff"],
    [/^(?:enable topup|topup on|start topup|topup)\b/, "topupOn"],
    [/^(?:stop caffeinate|caffeinate off)\b/, "caffeinateOff"],
    [/^(?:start caffeinate|caffeinate on|caffeinate)\b/, "caffeinateOn"],
    [/^sleep\b/, "sleep"],
    [/^wake\b/, "wake"],
    [/^brightness\b/, "brightness"],
    [/^fans?\b/, "fans"],
];
const weekdayTokens = {
    monday: "M",
    tuesday: "T",
    wednesday: "W",
    thursday: "R",
    friday: "F",
    saturday: "S",
    sunday: "U",
};
function minutes(amount, unit) {
    const value = Number(amount) * (unit.startsWith("h") ? 60 : unit.startsWith("d") ? 1440 : 1);
    if (!Number.isFinite(value) || value <= 0 || value > 525600)
        throw new Error("Use a duration greater than zero and no longer than one year.");
    return String(value);
}
function clock(text) {
    var _a;
    const match = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
    if (!match)
        throw new Error("Use a time such as 9am, 5:30pm, or 17:30.");
    let hour = Number(match[1]);
    const minute = Number((_a = match[2]) !== null && _a !== void 0 ? _a : 0);
    if (minute > 59 || (match[3] ? hour < 1 || hour > 12 : hour > 23))
        throw new Error("Enter a valid time.");
    if (match[3])
        hour = (hour % 12) + (match[3] === "pm" ? 12 : 0);
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}
function weekdayList(text) {
    const normalized = text.replace(/^every\s+/, "");
    if (["daily", "day", "every day"].includes(normalized))
        return ["M", "T", "W", "R", "F", "S", "U"];
    if (["weekday", "weekdays"].includes(normalized))
        return ["M", "T", "W", "R", "F"];
    if (["weekend", "weekends"].includes(normalized))
        return ["S", "U"];
    const names = normalized.split(/\s*(?:,|\band\b)\s*/).filter(Boolean);
    const tokens = names.map((name) => weekdayTokens[name.replace(/s$/, "")]);
    if (!tokens.length || tokens.some((token) => !token))
        throw new Error("Use weekdays, weekends, daily, or named days such as every Monday and Friday.");
    return [...new Set(tokens)];
}
function parseEvent(input, now = new Date()) {
    var _a;
    let text = input
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/^set\s+/, "");
    const matched = aliases
        .map(([pattern, action]) => ({ match: text.match(pattern), action }))
        .find(({ match }) => match);
    if (!(matched === null || matched === void 0 ? void 0 : matched.match))
        throw new Error("Start with an event such as sleep, low power, topup on, caffeinate, brightness, or fans.");
    const values = { action: matched.action };
    text = text.slice(matched.match[0].length).trim();
    if (values.action === "brightness" || values.action === "fans") {
        const control = text.match(/^(?:to\s+)?(system|\d{1,3}%)\s*/);
        if (!control)
            throw new Error("Specify a percentage or System, such as brightness 50% tomorrow at 9am.");
        if (control[1] === "system")
            values.mode = "system";
        else {
            values.mode = "fixed";
            values.percent = control[1].slice(0, -1);
            if (Number(values.percent) > 100)
                throw new Error("Percentage must be between 0 and 100.");
        }
        text = text.slice(control[0].length).trim();
    }
    const wait = text.match(/\s+wait for ac (\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?|days?)$/);
    if (wait) {
        if (values.action !== "topupOn")
            throw new Error("Wait for AC is only available for enabling Topup.");
        values.wait = minutes(wait[1], wait[2]);
        text = text.slice(0, wait.index).trim();
    }
    const duration = text.match(/\s+for (\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?|days?)$/);
    if (duration) {
        if (!durationActions.has(values.action))
            throw new Error("This event does not support an expiration duration.");
        values.duration = minutes(duration[1], duration[2]);
        text = text.slice(0, duration.index).trim();
    }
    const relative = text.match(/^in (\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?|days?)$/);
    if (relative) {
        values.date = new Date(now.getTime() + Number(minutes(relative[1], relative[2])) * 60000);
        eventParameters(values, false, now.getTime());
        return { values, repeating: false, nextDate: values.date };
    }
    const schedule = text.match(/^(?:(.+?)\s+)?at\s+(.+)$/);
    if (!schedule)
        throw new Error("Add a schedule: in 30 minutes, tomorrow at 9am, or weekdays at 09:00.");
    const day = (_a = schedule[1]) !== null && _a !== void 0 ? _a : "";
    const time = clock(schedule[2]);
    const repeating = /^(?:every\s+|daily$|weekdays$|weekends$)/.test(day) ||
        Object.keys(weekdayTokens).some((name) => day === `${name}s`);
    if (repeating) {
        values.weekdays = weekdayList(day);
        values.time = time;
        const nextDate = nextOccurrence(values.weekdays, time, now);
        if (!nextDate)
            throw new Error("Could not calculate the next occurrence.");
        eventParameters(values, true, now.getTime());
        return { values, repeating: true, nextDate };
    }
    const [hour, minute] = time.split(":").map(Number);
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    if (day === "tomorrow")
        date.setDate(date.getDate() + 1);
    else if (day === "today") {
        date.setDate(now.getDate());
    }
    else if (!day) {
        if (date <= now)
            date.setDate(date.getDate() + 1);
    }
    else if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
        const [year, month, dayOfMonth] = day.split("-").map(Number);
        date.setFullYear(year, month - 1, dayOfMonth);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== dayOfMonth)
            throw new Error("Enter a valid calendar date.");
    }
    else {
        const token = weekdayTokens[day.replace(/^next /, "")];
        if (!token)
            throw new Error("Use today, tomorrow, YYYY-MM-DD, or a weekday. Prefix every for weekly repetition.");
        const target = ["U", "M", "T", "W", "R", "F", "S"].indexOf(token);
        let offset = (target - now.getDay() + 7) % 7;
        if (offset === 0 && (date <= now || day.startsWith("next ")))
            offset = 7;
        date.setDate(date.getDate() + offset);
    }
    if (date.getHours() !== hour || date.getMinutes() !== minute)
        throw new Error("That local time does not exist on this date because of a clock change. Choose another time.");
    values.date = date;
    eventParameters(values, false, now.getTime());
    return { values, repeating: false, nextDate: date };
}

return { parseEvent, eventParameters, nextOccurrence, eventSummary, valuesForEvent, actionTitle, powerActions, days };
})();
