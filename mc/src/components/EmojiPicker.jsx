import React, { useState } from 'react';

const EmojiPicker = ({ onEmojiSelect }) => {
  const [activeCategory, setActiveCategory] = useState('smileys');

  const emojiCategories = {
    smileys: {
      name: '😊 Smileys',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
        '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
        '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
        '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
        '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧'
      ]
    },
    hearts: {
      name: '❤️ Hearts',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
        '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'
      ]
    },
    gestures: {
      name: '👋 Gestures',
      emojis: [
        '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
        '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
        '👊', '👌', '🤲', '👐', '🙌', '👏', '🤝', '🙏'
      ]
    },
    objects: {
      name: '🎉 Objects',
      emojis: [
        '🎉', '🎁', '🎈', '🎂', '🍰', '🎊', '🎨', '⚽', '🏀', '🏈',
        '⚾', '🎾', '🏐', '🏉', '🥎', '🎱', '🪀', '🏓', '🏸', '🏒',
        '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊'
      ]
    },
    nature: {
      name: '🌸 Nature',
      emojis: [
        '🌸', '💐', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴',
        '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍃', '🍂',
        '🍁', '🪨', '🪵', '🔥', '💧', '⭐', '🌟', '✨', '⚡', '☄️'
      ]
    },
    food: {
      name: '🍕 Food',
      emojis: [
        '🍕', '🍔', '🍟', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥚',
        '🍳', '🥘', '🍲', '🥗', '🍿', '🧈', '🧀', '🥞', '🧇', '🥓',
        '🍗', '🍖', '🌭', '🥩', '🍤', '🍣', '🍱', '🍜', '🍛', '🍝'
      ]
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-lg p-4 max-h-80 overflow-hidden">
      {/* Category Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {Object.entries(emojiCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === key
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {category.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
        {emojiCategories[activeCategory].emojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => onEmojiSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;