import escapeHtml from 'escape-html'
import twemoji from 'twemoji'
import emoji from 'node-emoji'

let formatText = (message) => {
  // we can't use DOM parsing, it bugs out too much
  // sad face
  // the uk emoji is weird, don't worry about it
  let workingMessage = message;
  workingMessage = workingMessage.replaceAll("\\n", "  \n");
  workingMessage = workingMessage.replaceAll(":flag-uk:", ":uk:");
  workingMessage = escapeHtml(workingMessage);
  workingMessage = emoji.emojify(workingMessage);
  workingMessage = twemoji.parse(workingMessage);
  return workingMessage;
};

export default formatText;