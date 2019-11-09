import escapeHtml from 'escape-html'
import twemoji from 'twemoji'
import emoji from 'node-emoji'

export default formatText = (message) => {
  // we can't use DOM parsing, it bugs out too much
  // sad face
  // the uk emoji is weird, don't worry about it
  return twemoji.parse(emoji.emojify(escapeHtml(message.replaceAll("\\n", "  \n").replaceAll("`", "&$96;").replaceAll(":flag-uk:", ":uk:"))))
}