import WiFi from 'wifi';
import Net from 'net';

import Analog from 'pins/analog';
import Timer from 'timer';

import { File } from 'file'; // Moddable's default FS root for ESP32
import { Request } from 'http';

function init () {
  var ssid = 'testWLAN';
  var password = 'JavaScriptOnMCU';

  WiFi.mode = 1;

  const monitor = new WiFi({ ssid: ssid, password: password }, function (msg, code) {
    switch (msg) {
      case 'gotIP':
        trace(`IP address ${Net.get('IP')}\n`);
        monitor.close();
        loop(5);
        break;

      case 'connect':
        trace(`Wi-Fi connected to "${Net.get('SSID')}"\n`);
        break;

      case 'disconnect':
        trace((code === -1) ? 'Wi-Fi password rejected\n' : 'Wi-Fi disconnected\n');
        break;
    }
  });
}

var root = '/mod/';

/**
 * Converts the ADC value read from the NTC MF52 3950 Thermistor to temperature in Celsius.
 * @param {number} adcValue - an integer in the range of [0, 1023]
 * @returns {number} Temperature in Celsius
 */
function convertADCToTemp (adcValue) {
  var R = (1023 / adcValue) - 1;
  R = 10000 / R;

  var steinhart = R / 10000;
  steinhart = Math.log(steinhart);
  steinhart /= 3950;
  steinhart += 1 / (27.5 + 273.15);
  steinhart = 1 / steinhart;
  steinhart -= 273.15;

  return steinhart;
}

function storeTemp (temp) {
  var date = new Date();
  var logFileName = '' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + '.log';
  var content = '[' + date.toUTCString() + ']\t' + temp + ' °C\n';

  var file = new File(root + logFileName, true);
  file.write(content); // overwrite the current file
  file.close();
}

function postJSON (data) {
  var content = JSON.stringify(data);

  var options = {
    host: 'esp-temp-monitor.herokuapp.com',
    path: '/temperature',
    method: 'POST',
    headers: [
      'Content-Type', 'application/json',
      'Content-Length', content.length
    ],
    body: content,
    response: String
  };

  var req = new Request(options);
  req.callback = function (msg, status) {
    if (msg === Request.status) {
      trace('Response status: ' + status + '\n');
    }
  };
}

function measureAndUpdateTemp () {
  var adcValue = Analog.read(7);

  var temperature = convertADCToTemp(adcValue);
  trace('Current temperature: ' + temperature.toFixed(2) + ' °C\n');

  // Store temp to log file
  storeTemp(temperature);

  // Send temp to server
  postJSON({ temperature: temperature });
}

function loop (intervalInSec) {
  Timer.repeat(measureAndUpdateTemp, intervalInSec * 1000);
}

init();
loop(5);
