
import 'https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js'
import insertText from 'https://cdn.jsdelivr.net/npm/insert-text-at-cursor@0.3.0/index.js'

const button = document.querySelector('#emoji-button')
const tooltip = document.querySelector('.tooltip')

button.addEventListener("click",toggle_emoji)
document.querySelector('emoji-picker').addEventListener('emoji-click', e => {
    insertText(document.querySelector('#chat-message-input'), e.detail.unicode)
})
Popper.createPopper(button, tooltip)

function toggle_emoji(e) {
    e.preventDefault()
    tooltip.classList.toggle('shown')
}

// const picker = new Picker({
//     customEmoji: [
//         {
//           name: 'Garfield',
//           shortcodes: ['garfield'],
//           url: 'http://example.com/garfield.png',
//           category: 'Cats'
//         },
//         {
//           name: 'Heathcliff',
//           shortcodes: ['heathcliff'],
//           url: 'http://example.com/heathcliff.png',
//           category: 'Cats'
//         },
//         {
//           name: 'Scooby-Doo',
//           shortcodes: ['scooby'],
//           url: 'http://example.com/scooby.png',
//           category: 'Dogs'
//         }  
//       ]
//   });
