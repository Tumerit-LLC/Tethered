ObjC.import("Foundation");
ObjC.import("AppKit");
eval(ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError("event-parser.js", $.NSUTF8StringEncoding, null)));
eval(ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError("events.js", $.NSUTF8StringEncoding, null)));

function running() {
    return $.NSRunningApplication.runningApplicationsWithBundleIdentifier("com.Tumerit.Tethered").count > 0;
}

function send(url) {
    const info = $.NSDictionary.dictionaryWithObjectForKey($(url), $("url"));
    $.NSDistributedNotificationCenter.defaultCenter.postNotificationNameObjectUserInfoDeliverImmediately(
        $("com.Tumerit.Tethered.raycast.control"), undefined, info, true
    );
}

function stored(key) {
    const defaults = $.NSUserDefaults.alloc.initWithSuiteName("com.Tumerit.Tethered");
    defaults.synchronize;
    const data = defaults.dataForKey($(key));
    if (!data || data.isNil()) return undefined;
    const text = $.NSString.alloc.initWithDataEncoding(data, $.NSUTF8StringEncoding);
    return JSON.parse(ObjC.unwrap(text));
}

function statusRows() {
    if (!running()) return [{title: "Open Tethered to read status", subtitle: "The app must be running", valid: false}];
    const request = ObjC.unwrap($.NSUUID.UUID.UUIDString);
    const started = Date.now() / 1000;
    send("tethered://status?request=" + request);
    for (let attempt = 0; attempt < 30; attempt++) {
        let value;
        try { value = stored("raycastStatus"); } catch (_) {}
        if (value && value.request === request && typeof value.updatedAt === "number" && value.updatedAt >= started - 1) {
            const yesNo = function(flag) { return flag ? "On" : "Off"; };
            const level = typeof value.batteryLevel === "number" && value.batteryLevel >= 0 ? Math.round(value.batteryLevel) + "%" : "Unavailable";
            const rows = [
                {title: "Battery: " + level, subtitle: (value.isACConnected ? "Power connected" : "On battery") + " · " + (value.isCharging ? "Charging" : "Not charging"), valid: false},
                {title: "Power mode: " + value.powerMode, subtitle: "Caffeinate: " + yesNo(value.caffeinateActive), valid: false},
                {title: "Topup: " + yesNo(value.topupEnabled), subtitle: "Sailing: " + yesNo(value.sailingEnabled) + " · Heat protection: " + yesNo(value.heatProtectionEnabled), valid: false},
                {title: "Profile: " + (value.activeProfile || "None"), subtitle: "Calibration: " + value.calibrationPhase, valid: false}
            ];
            if (typeof value.mcpBridgeEnabled === "boolean") rows.push({title: "MCP Bridge: " + yesNo(value.mcpBridgeEnabled), subtitle: value.mcpBridgeStatus || "", valid: false});
            return rows;
        }
        $.NSThread.sleepForTimeInterval(0.1);
    }
    return [{title: "Tethered did not return fresh status", subtitle: "Open the updated app and try again", valid: false}];
}

function run(argv) {
    const mode = argv[0];
    if (mode === "menu") {
        try { return JSON.stringify({items: argv[1] === "status" ? statusRows() : AlfredEventUI.menu(argv[1] || "events")}); }
        catch (error) { return JSON.stringify({items: [{title: "Could not load Tethered commands", subtitle: error.message || String(error), valid: false}]}); }
    }
    if (mode === "action") {
        try {
            const action = JSON.parse(argv[1]);
            if (action.operation) return AlfredEventUI.execute(action);
            if (action.url === "open-app") {
                const appURL = $.NSWorkspace.sharedWorkspace.URLForApplicationWithBundleIdentifier("com.Tumerit.Tethered");
                if (!appURL || appURL.isNil()) return "Install Tethered first: tetheredmac.com";
                $.NSWorkspace.sharedWorkspace.openURL(appURL);
                return "Opening Tethered";
            }
            if (typeof action.url !== "string" || !/^tethered:\/\/control\//.test(action.url)) return "Invalid Tethered command";
            if (!running()) return "Open Tethered before using controls";
            send(action.url);
            return "Request sent: " + action.title + ". Check tethered status to confirm.";
        } catch (error) { return "Tethered: " + (error.message || String(error)); }
    }
}
