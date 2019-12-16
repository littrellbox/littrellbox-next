import escapeHtml from 'escape-html'
import twemoji from 'twemoji'
import emoji from 'node-emoji'

let formatText = (message) => {
  // we can't use DOM parsing, it bugs out too much
  let workingMessage = message;
  workingMessage = escapeHtml(workingMessage);
  workingMessage = workingMessage.replaceAll(/( @[A-Za-z0-9_])\w+/g, formatPing);
  workingMessage = workingMessage.replaceAll(/(^@[A-Za-z0-9_])\w+/, formatNewLinePing);
  workingMessage = workingMessage.replaceAll(/(\n\n@[A-Za-z0-9_])\w+/, formatUnformattedNewLinePing); //workaround for how we handle new lines
  workingMessage = workingMessage.replaceAll(":flag-uk:", ":uk:"); //handle UK flag edge-case
  workingMessage = emoji.emojify(workingMessage);
  workingMessage = twemoji.parse(workingMessage);
  return workingMessage;
};

function formatPing(match) {
  return match.substring(0, 1) + "<span class='message-mention'>" + match.substring(1, match.length) + "</span>"
}

function formatNewLinePing(match) {
  return "<span class='message-mention'>" + match + "</span>"
}

function formatUnformattedNewLinePing(match) {
  return "\n\n<span class='message-mention'>" + match.substring(2, match.length) + "</span>"
}

export default formatText;