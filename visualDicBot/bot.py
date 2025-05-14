from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import (
    Application, CommandHandler, MessageHandler, filters,
    ContextTypes, ConversationHandler
)

import os

# Bot states
CHOOSING_CATEGORY, CHOOSING_WORD = range(2)

# Your dictionary data
dictionary = {
    "🍎 Fruits": {
        "яблоко": {"fa": "سیب", "image": "images/apple.jpg"},
        "банан": {"fa": "موز", "image": "images/banana.jpg"}
    },
    "🥦 Vegetables": {
        "морковь": {"fa": "هویج", "image": "images/carrot.jpg"},
        "огурец": {"fa": "خیار", "image": "images/cucumber.jpg"}
    },
    "🐶 Animals": {
        "собака": {"fa": "سگ", "image": "images/dog.jpg"},
        "кот": {"fa": "گربه", "image": "images/cat.jpg"}
    },
    "🏠 Household": {
        "стол": {"fa": "میز", "image": "images/table.jpg"},
        "кровать": {"fa": "تخت", "image": "images/bed.jpg"}
    },
    "🚗 Transport": {
        "машина": {"fa": "ماشین", "image": "images/car.jpg"},
        "велосипед": {"fa": "دوچرخه", "image": "images/bicycle.jpg"}
    },
    "👕 Clothes": {
        "рубашка": {"fa": "پیراهن", "image": "images/shirt.jpg"},
        "шапка": {"fa": "کلاه", "image": "images/hat.jpg"}
    },
    "🛠️ Tools": {
        "молоток": {"fa": "چکش", "image": "images/hammer.jpg"},
        "пила": {"fa": "اره", "image": "images/saw.jpg"}
    },
    "📚 School": {
        "книга": {"fa": "کتاب", "image": "images/book.jpg"},
        "ручка": {"fa": "خودکار", "image": "images/pen.jpg"}
    }
}

# Store selected category in user_data


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[KeyboardButton(cat)] for cat in dictionary.keys()]
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    await update.message.reply_text("👋 Choose a category:", reply_markup=reply_markup)
    return CHOOSING_CATEGORY


async def choose_category(update: Update, context: ContextTypes.DEFAULT_TYPE):
    category = update.message.text
    if category not in dictionary:
        await update.message.reply_text("❗ Invalid category. Choose again.")
        return CHOOSING_CATEGORY

    context.user_data["category"] = category
    words = list(dictionary[category].keys())
    keyboard = [[KeyboardButton(word)] for word in words]
    keyboard.append([KeyboardButton("🔙 Back to Categories")])
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)

    await update.message.reply_text(f"📖 Words in {category}:", reply_markup=reply_markup)
    return CHOOSING_WORD


async def choose_word(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text

    if text == "🔙 Back to Categories":
        return await start(update, context)

    category = context.user_data.get("category")
    if not category or text not in dictionary[category]:
        await update.message.reply_text("⚠️ Word not found. Try another.")
        return CHOOSING_WORD

    entry = dictionary[category][text]
    fa = entry["fa"]
    image_path = entry["image"]

    if os.path.exists(image_path):
        await update.message.reply_photo(photo=open(image_path, "rb"), caption=f"🇷🇺 {text} → 🇮🇷 {fa}")
    else:
        await update.message.reply_text(f"🇷🇺 {text} → 🇮🇷 {fa}\n⚠️ Image not found.")

    return CHOOSING_WORD


async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("👋 Goodbye!")
    return ConversationHandler.END


def main():
    TOKEN = "7694489775:AAHBJR9Rxp77Grhmc3mRKNH3mNvzC3yQw7c"  # ← Replace with your real bot token
    app = Application.builder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            CHOOSING_CATEGORY: [MessageHandler(filters.TEXT & ~filters.COMMAND, choose_category)],
            CHOOSING_WORD: [MessageHandler(filters.TEXT & ~filters.COMMAND, choose_word)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(conv_handler)
    print("✅ Bot is running...")
    app.run_polling()


if __name__ == "__main__":
    main()
