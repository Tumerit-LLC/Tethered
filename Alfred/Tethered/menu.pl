use utf8;
use strict;
use warnings;
use JSON::PP;
use MIME::Base64 qw(decode_base64);
use Encode qw(decode);

my $query = decode('UTF-8', $ARGV[0] // '');
$query =~ s/^\s+|\s+$//g;
if ($query =~ /^(?:status|events|next|quick|schedule|repeat|event|edit|delete)(?:\s|$)/i) {
    exec '/usr/bin/osascript', '-l', 'JavaScript', 'tethered.js', 'menu', $query;
    die "Could not start status request";
}
my $icons = decode_json('{"/power/auto": "gauge.with.needle", "/power/low": "leaf.fill", "/power/high": "bolt.fill", "/caffeinate/start": "cup.and.heat.waves.fill", "/caffeinate/stop": "cup.and.saucer", "/caffeinate/timed": "cup.and.heat.waves", "/topup/enable": "battery.100.bolt", "/topup/disable": "battery.75", "/sailing/enable": "sailboat.fill", "/sailing/disable": "sailboat", "/heat-protection/enable": "thermometer.medium", "/heat-protection/disable": "thermometer.medium.slash", "/calibration/start": "minus.plus.batteryblock.fill", "/calibration/cancel": "batteryblock.slash.fill", "/profile/apply": "slider.horizontal.3", "/caffeinate/preset": "mug.fill"}');
my $commands = decode_json('[["Auto Power", "Use automatic power mode", "/power/auto"], ["Low Power", "Switch to Low Power mode", "/power/low"], ["High Power", "Requires a supported Mac and enabled High Power controls", "/power/high"], ["Start Caffeinate", "Keep your Mac awake until stopped \u00b7 Pro", "/caffeinate/start"], ["Stop Caffeinate", "End the current keep-awake session \u00b7 Pro", "/caffeinate/stop"], ["Enable Topup", "Charge to full \u00b7 Requires AC and charging control \u00b7 Pro", "/topup/enable"], ["Disable Topup", "Return to the normal charging limit \u00b7 Pro", "/topup/disable"], ["Enable Sailing", "Enable Sailing", "/sailing/enable"], ["Disable Sailing", "Disable Sailing", "/sailing/disable"], ["Enable Heat Protection", "Enable battery temperature protection", "/heat-protection/enable"], ["Disable Heat Protection", "Disable battery temperature protection", "/heat-protection/disable"], ["Start Calibration \u2014 charge and discharge battery", "Manual calibration can charge to full, then discharge the battery", "/calibration/start"], ["Cancel Calibration", "Cancel a manual calibration cycle", "/calibration/cancel"]]');
sub row {
    my ($title, $subtitle, $url) = @_;
    my $path = $url;
    $path =~ s{^tethered://control}{};
    $path =~ s/\?.*$//;
    my $icon = $icons->{$path};
    return {title => $title, subtitle => $subtitle, arg => JSON::PP->new->encode({url => $url, title => $title}), valid => JSON::PP::true, icon => {path => $icon ? "icons/$icon.png" : 'icon.png'}};
}
sub result {
    print encode_json({items => $_[0]});
    exit;
}
if ($query =~ /^(?:caffeinate|awake)\s+(\d+)$/i) {
    my $minutes = 0 + $1;
    result($minutes >= 1 && $minutes <= 1440 ? [row("Caffeinate for $minutes minutes", "Keep your Mac and display awake · Pro", "tethered://control/caffeinate/timed?minutes=$minutes")] : [{title => 'Choose 1–1,440 minutes', valid => JSON::PP::false}]);
}
my @items = map {row($_->[0], $_->[1], 'tethered://control' . $_->[2])} @$commands;
unshift @items, {title => 'Show Status', subtitle => 'Read fresh battery and control status', autocomplete => 'status', valid => JSON::PP::false, icon => {path => 'icons/minus.plus.batteryblock.stack.fill.png'}};
push @items, {title => 'Timed Caffeinate', subtitle => 'Type tethered awake 30 for a 30-minute session', autocomplete => 'awake ', valid => JSON::PP::false, icon => {path => 'icons/cup.and.heat.waves.png'}};
push @items, {title => 'Events', subtitle => 'List, edit, delete, and enable or disable repeating events', autocomplete => 'events', valid => JSON::PP::false};
push @items, {title => 'Next Event', subtitle => 'Display the next enabled upcoming event', autocomplete => 'next', valid => JSON::PP::false};
push @items, {title => 'Quick Event', subtitle => 'Type a schedule and preview it before creating', autocomplete => 'quick ', valid => JSON::PP::false};
push @items, {title => 'Create Scheduled Event', subtitle => 'Example: schedule sleep tomorrow at 11pm', autocomplete => 'schedule ', valid => JSON::PP::false};
push @items, {title => 'Create Repeating Event', subtitle => 'Example: repeat low power weekdays at 9am', autocomplete => 'repeat ', valid => JSON::PP::false};
push @items, row('Toggle MCP Bridge', 'Enable or disable the bridge; disabling ends the active task session', 'tethered://control/mcp-bridge/toggle');
push @items, {title => 'Toggle Companion Sync', subtitle => 'Requires app support; reports app-confirmed errors or success', arg => encode_json({operation => 'companion-toggle'}), valid => JSON::PP::true};
my $plist = '';
if (open my $preferences, '-|', '/usr/bin/defaults', 'export', 'com.Tumerit.Tethered', '-') {
    local $/;
    $plist = <$preferences> // '';
    close $preferences;
}
for my $group (['settingsProfiles', 'Apply Tethered Profile', '/profile/apply'], ['caffeinatePresets', 'Run Caffeinate Preset', '/caffeinate/preset']) {
    my ($key, $title, $path) = @$group;
    next unless $plist =~ /<key>\Q$key\E<\/key>\s*(.*?)(?=<key>|<\/dict>)/s;
    my $stored = $1;
    my $ok = eval {
        die 'Unexpected stored format' unless $stored =~ /^<data>(.*?)<\/data>/s;
        my $entries = decode_json(decode_base64($1));
        die 'Unexpected stored format' unless ref($entries) eq 'ARRAY';
        for my $entry (@$entries) {
            next unless ref($entry) eq 'HASH' && defined($entry->{name}) && !ref($entry->{name}) && $entry->{name} =~ /\S/;
            my $name = $entry->{name};
            my $encoded = Encode::encode('UTF-8', $name);
            $encoded =~ s/([^A-Za-z0-9\-_.!~*'()])/sprintf('%%%02X', ord($1))/ge;
            push @items, row("$title: $name", "Use $name · Pro", "tethered://control$path?name=$encoded");
        }
        1;
    };
    push @items, {title => 'Could not read saved ' . lc($title) . ' items', subtitle => 'Open Tethered and save an item, then try again', valid => JSON::PP::false} unless $ok;
}
push @items, row('Open Tethered', 'Open the installed app', 'open-app');
my @words = split /\s+/, lc($query);
@items = grep {
    my $text = lc($_->{title} . ' ' . ($_->{subtitle} // ''));
    !grep {index($text, $_) < 0} @words;
} @items;
my $running = 0;
if (open my $processes, '-|', '/usr/bin/pgrep', '-x', 'Tethered') {
    $running = defined(<$processes>);
    close $processes;
}
unshift @items, row('Open Tethered to use controls', 'Tethered must be installed and running', 'open-app') unless $running;
result(@items ? \@items : [{title => 'No matching Tethered commands', subtitle => 'Try power, profile, caffeinate, awake 30, or status', valid => JSON::PP::false}]);
