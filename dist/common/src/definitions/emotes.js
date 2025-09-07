"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emotes = exports.getBadgeIdString = exports.isEmoteBadge = exports.EmoteCategory = void 0;
const objectDefinitions_1 = require("../utils/objectDefinitions");
const ammos_1 = require("./items/ammos");
const guns_1 = require("./items/guns");
const healingItems_1 = require("./items/healingItems");
const melees_1 = require("./items/melees");
const throwables_1 = require("./items/throwables");
var EmoteCategory;
(function (EmoteCategory) {
    EmoteCategory[EmoteCategory["People"] = 0] = "People";
    EmoteCategory[EmoteCategory["Text"] = 1] = "Text";
    EmoteCategory[EmoteCategory["Memes"] = 2] = "Memes";
    EmoteCategory[EmoteCategory["Icons"] = 3] = "Icons";
    EmoteCategory[EmoteCategory["Misc"] = 4] = "Misc";
    EmoteCategory[EmoteCategory["Team"] = 5] = "Team";
    EmoteCategory[EmoteCategory["Weapon"] = 6] = "Weapon";
})(EmoteCategory || (exports.EmoteCategory = EmoteCategory = {}));
const isEmoteBadge = (badge) => {
    const bdgIdString = typeof badge === "string" ? badge.slice(4) : badge.idString.slice(4);
    const found = exports.Emotes.definitions.find(emote => {
        return emote.idString === bdgIdString;
    }) !== undefined;
    return found;
};
exports.isEmoteBadge = isEmoteBadge;
const getBadgeIdString = (badge) => {
    const bdg = typeof badge === "string" ? badge : badge.idString;
    return (0, exports.isEmoteBadge)(badge) ? bdg.slice(4) : bdg;
};
exports.getBadgeIdString = getBadgeIdString;
exports.Emotes = new objectDefinitions_1.ObjectDefinitions([
    ...Object.entries({
        [EmoteCategory.People]: [
            "Happy Face",
            "Sad Face",
            "Thumbs Up",
            "Thumbs Down",
            "Wave",
            "Disappointed Face",
            "Sobbing Face",
            "Angry Face",
            "Heart Face",
            "Flushed Face",
            "Joyful Face",
            "Cool Face",
            "Upside Down Face",
            "Picasso Face",
            "Alien",
            "Headshot",
            "Panned",
            "Dab",
            "Devil Face",
            "Bandaged Face",
            "Cold Face",
            "Thinking Face",
            "Nervous Face",
            "Sweating Face",
            "Greedy Face",
            "Creepy Clown",
            "Lying Face",
            "Nerd Face",
            "Side Eye Face",
            "Man Face",
            "Satisfied Face",
            "Hot Face",
            "Blindfolded Face",
            "Melting Face",
            "Grimacing Face",
            "Vomiting Face",
            "Screaming Face",
            "Pleading Face",
            "Sad Smiling Face",
            "Triumphant Face",
            "Questioning Face",
            "Shrugging Face",
            "Facepalm",
            "Smirking Face",
            "Blushing Face",
            "Saluting Face",
            "Neutral Face",
            "Relieved Face",
            "Monocle Face",
            "Partying Face",
            "Shushing Face",
            "Sighing Face",
            "Yawning Face",
            "Frustrated Face",
            "Thousand Yard Stare",
            "Weary Face",
            "Pensive Face",
            "Zipper Mouth Face",
            "Zombie Face"
        ],
        [EmoteCategory.Icons]: [
            "Suroi Logo",
            "AEGIS Logo",
            "Flint Logo",
            "NSD Logo",
            "Skull",
            "Duel",
            "Chicken Dinner",
            "Trophy"
        ],
        [EmoteCategory.Memes]: [
            "Troll Face",
            "Clueless",
            "Pog",
            "Froog",
            "Bleh",
            "Muller",
            "Suroi General Chat",
            "RIP",
            "Leosmug",
            "awhhmahgawd",
            "emoji_50",
            "Boykisser",
            "Grr",
            "are you sure"
        ],
        [EmoteCategory.Text]: [
            "Question Mark",
            "Team = Ban",
            "Hack = Ban",
            "gg",
            "ez",
            "Hi5",
            "oof",
            "real",
            "fake",
            "Colon Three",
            "Lag"
        ],
        [EmoteCategory.Misc]: [
            "Fire",
            "Heart",
            "Penguin",
            "Squid",
            "Eagle",
            "Whale",
            "Carrot",
            "Egg",
            "Wilted Rose",
            "Plumpkin",
            "Leek",
            "Tomato",
            "Logged",
            "Sun and Moon"
        ]
    }).flatMap(([category, names]) => names.map(name => ({
        idString: name.toLowerCase().split(" ").join("_"),
        name,
        defType: objectDefinitions_1.DefinitionType.Emote,
        category: parseInt(category)
    }))),
    ...[
        ...ammos_1.Ammos,
        ...healingItems_1.HealingItems
    ].map(({ idString, name }) => ({
        idString,
        name,
        defType: objectDefinitions_1.DefinitionType.Emote,
        category: EmoteCategory.Team,
        hideInLoadout: true
    })),
    ...[
        ...guns_1.Guns,
        ...melees_1.Melees,
        ...throwables_1.Throwables
    ].map(({ idString, name }) => ({
        idString,
        name,
        defType: objectDefinitions_1.DefinitionType.Emote,
        category: EmoteCategory.Weapon,
        hideInLoadout: true
    }))
]);
//# sourceMappingURL=emotes.js.map