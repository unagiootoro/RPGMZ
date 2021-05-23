/*:
@target MV MZ
@plugindesc Skill tree config
@author unagi ootoro
@url https://raw.githubusercontent.com/unagiootoro/RPGMZ/master/SkillTreeConfig.js

@help
[Overview]
A plugin that introduces a skill tree.
You can create a skill tree to learn skills using SP.

[how to use]
■ Skill tree settings
Skill tree settings are made by editing the "SkillTreeConfig.js" file.
As a basic setting, set the type of skill tree (sword skill, magic skill, etc.) for each actor,
Then build a skill tree for each type.
The skill tree is constructed by skill derivation settings (Fire II can be acquired after acquiring Fire I, etc.).

■ SP acquisition settings
SP is required to acquire skills.
How to get SP
・Acquisition by end of battle
・SP acquisition by leveling up
You can make two settings.

・How to set SP obtained at the end of battle
In the memo field of the enemy character
<battleEndGainSp: SP>
It is described in the format of.

・Set SP acquisition method by leveling up
It is set by "levelUpGainSp" in the config.

■ How to get SP at an event
In the script
skt_gainSp(Actor ID, SP value to acquire)
By describing as, you can get the SP specified by the relevant actor.
For example, if an actor with an actor ID of 1 wins 5SP,
skt_gainSp(1, 5);
Is described.

■ Skill reset
In the script
skt_skillReset(Actor ID);
By describing, you can reset the skill once learned.
For example, when performing skill reset for an actor with an actor ID of 1,
skt_skillReset(1);
Is described.

■ Skill tree type enabled/disabled
In the script
skt_enableType(Actor ID, "type name");
Type to enable the type.

If you want to disable
skt_disableType(Actor ID, "type name")
Is described.

Disabled types do not appear in the skill tree type list.

■Type takeover
If you want a new skill to be added to the skill tree when certain conditions are met, use "type takeover".
For example, if you want to change the type "Lower Magic" to "Higher Magic", after registering both types in the config beforehand,
"Higher magic" is invalidated. Then, using the type transfer function, you can transfer "lower magic" to "upper magic".

If you want to take over the type,
skt_migrationType(Actor ID, "Takeover source type name", "Takeover destination type name", Reset required);
Is described. Regarding reset presence/absence, if you want to reset the skill tree of the source type after the takeover, set true
If you do not want to reset, specify false.
For example, if an actor with an actor ID of 1 has the type "Lower level magic" taken over by "Higher level magic" and resets the skill,
skt_migrationType(Actor ID, "Lower Magic", "Higher Magic", true);
Is described.

■ Read the skill tree from the map
By reading the placement coordinates of each skill in the skill tree from the map, you can create a skill tree with a somewhat free layout.
Can be created Only the coordinates of skills can be set by this function, and the lines between skills are drawn on the plugin side.

・Setting of skill coordinates
The settings will be made at the event on the map.
For example, if you have a "fire" skill, create an empty event at the coordinates where you want to place the skill,
In the memo field of the event
fire
Is described. Then, the XY coordinates of the event described in "Fire" and the memo column are used as the XY coordinates of the skill.

・Map loading
First, use the event command to "move" to the map where the skill tree will be loaded.
And the script
skt_loadMap (target actor ID of skill tree, target type name of skill tree)
Run.
For example, if you want to read a skill tree of type "attack magic" with an actor with actor ID 1,
skt_loadMap(1, "attack magic");
Is described.

■ Launch the skill tree from the script
In script
skt_open (actor ID);
By writing, you can start the skill tree of the specified actor.
*/

const loadSkillTreeConfig = () => {
return {
// =============================================================
// ●From here, it is a setting item.
// =============================================================

// Set the skill tree type.
// skillTreeTypes: Add type settings for the number of actors in [ ... ].

// Set the type setting in the following format.
// {actorId: Actor ID, types: [Type information 1, Type information 2, ...]}

// Set the type information in the following format.
// [Type classification, type name, type description, valid/invalid]
// Type type... Set a unique identifier to identify the type in the skill derivation settings.
// Type name... Set the type name to be displayed in the type list window.
// Type description... Set the type description to be displayed in the type list window.
// Type valid/invalid... Specify true to enable the type and false to disable it.
//                       This item is optional. If omitted, true is specified.
skillTreeTypes: [
    {
        actorId: 1,
        types: [
            ["Sword skill", "Sword skill", "Get sword skill."],
            ["Martial arts", "Martial arts", "Get martial arts."],
        ]
    },

    {
        actorId: 2,
        types: [
            ["Sword skill", "Sword skill", "Get sword skill."],
            ["Martial arts", "Martial arts", "Get martial arts."],
        ]
    },

    {
        actorId: 3,
        types: [
            ["Sword skill", "Sword skill", "Get sword skill."],
            ["Martial arts", "Martial arts", "Get martial arts."],
        ]
    },

    {
        actorId: 4,
        types: [
            ["Sword skill", "Sword skill", "Get sword skill."],
            ["Martial arts", "Martial arts", "Get martial arts."],
        ]
    },

    {
        actorId: 5,
        types: [
            ["Attack magic", "Attack magic", "Get attack magic."],
            ["Recovery magic", "Recovery magic", "Get recovery magic."],
        ]
    },

    {
        actorId: 6,
        types: [
            ["Attack magic", "Attack magic", "Get attack magic."],
            ["Recovery magic", "Recovery magic", "Get recovery magic."],
        ]
    },

    {
        actorId: 7,
        types: [
            ["Attack magic", "Attack magic", "Get attack magic."],
            ["Recovery magic", "Recovery magic", "Get recovery magic."],
        ]
    },

    {
        actorId: 8,
        types: [
            ["Attack magic", "Attack magic", "Get attack magic."],
            ["Recovery magic", "Recovery magic", "Get recovery magic."],
        ]
    },
],

// Set the skill tree map loading settings.
// Specify the map to read in the following format.
// skillTreeMapId: { skillTreeName1: mapID1, skillTreeName2: mapID2, ... }
// skillTreeName ... Specifies the skill tree type name.
// mapID ... Specify the map ID to read. If it is 0, it will not be read.
skillTreeMapId: {
    "Attack magic": 0,
    "Recovery magic": 0,
    "Sword skill": 0,
    "Martial arts": 0,
},

// Register information for each skill.
// skillTreeInfo: Skill information for the number of skills to be registered in [] will be registered.

// Skill information is registered in the following format.
// [Skill name, skill ID, required SP, icon information]
// Skill name... An identifier to uniquely identify the skill in the derived setting of the skill tree
//               Since it is an identifier, it does not matter if it does not match the actual skill name.
// Skill ID... ID of the corresponding skill on the database
// Required SP...SP required to acquire skills
// For icon information, register in the following format depending on whether to use icons or arbitrary images.
// When using an icon ["icon", iconIndex]
// iconIndex... Index of the icon to use
//              iconIndex is optional. If omitted, the icon set for the skill is used.
// When using an image ["img", fileName]
// fileName... File name of the image. Import the images into the "img/pictures" folder.
skillTreeInfo: [
    // Sword skill
    ["Strong Attack", 172, 1, ["icon"]],
    ["Slash", 173, 1, ["icon"]],
    ["Dual Attack", 174, 1, ["icon"]],
    ["Willpower", 175, 1, ["icon"]],
    ["First Aid", 176, 1, ["icon"]],
    ["Maiden’s Stance", 177, 1, ["icon"]],
    ["Spin Crash", 178, 1, ["icon"]],

    // Martial arts
    ["Sweep", 216, 1, ["icon"]],
    ["Qigong", 217, 1, ["icon"]],
    ["Roundhouse Kick", 218, 1, ["icon"]],
    ["Tiger Dance", 219, 1, ["icon"]],

    // Attack magic
    ["Fire Ⅰ", 99, 1, ["icon"]],
    ["Fire Ⅱ", 100, 1, ["icon"]],
    ["Fire Ⅲ", 101, 1, ["icon"]],

    ["Flame Ⅰ", 103, 1, ["icon"]],
    ["Flame Ⅱ", 104, 1, ["icon"]],
    ["Flame Ⅲ", 105, 1, ["icon"]],

    ["Ice Ⅰ", 107, 1, ["icon"]],
    ["Ice Ⅱ", 108, 1, ["icon"]],
    ["Ice Ⅲ", 109, 1, ["icon"]],

    ["Blizzard Ⅰ", 111, 1, ["icon"]],
    ["Blizzard Ⅱ", 112, 1, ["icon"]],
    ["Blizzard Ⅲ", 113, 1, ["icon"]],

    ["Thunder Ⅰ", 115, 1, ["icon"]],
    ["Thunder Ⅱ", 116, 1, ["icon"]],
    ["Thunder Ⅲ", 117, 1, ["icon"]],

    ["Spark Ⅰ", 119, 1, ["icon"]],
    ["Spark Ⅱ", 120, 1, ["icon"]],
    ["Spark Ⅲ", 121, 1, ["icon"]],

    ["Nuke Ⅰ", 156, 1, ["icon"]],
    ["Nuke Ⅱ", 157, 1, ["icon"]],

    // Recovery magic
    ["Heal Ⅰ", 52, 1, ["icon"]],
    ["Heal Ⅱ", 53, 1, ["icon"]],
    ["Heal Ⅲ", 54, 1, ["icon"]],

    ["Recover Ⅰ", 56, 1, ["icon"]],
    ["Recover Ⅱ", 57, 1, ["icon"]],
    ["Recover Ⅲ", 58, 1, ["icon"]],

    ["Cure Ⅰ", 60, 1, ["icon"]],
    ["Cure Ⅱ", 61, 1, ["icon"]],
    ["Cure Ⅲ", 62, 1, ["icon"]],

    ["Raise Ⅰ", 64, 1, ["icon"]],
    ["Raise Ⅱ", 65, 1, ["icon"]],
],

// Set up the derivative of the skill tree.
// Register skill trees for the number of types in skillTreeDerivative: {～ }.

// Set up the skill tree derivation as follows.
// "Type name": [[Skill1, [Derivation skill1, Derivation skill2, ...]], [Skill2, [Derivation skill3, Derivation skill4, ...]]
// *If the terminal skill does not have a derived skill, the derived skill can be omitted.
//
// For example, if you get "Watch" and "Continuous Attack", you can get "Twice Attack" with the following settings.
// ["Watch", ["Twice attack"]],
// ["continuous attack", ["double attack"]],
// ["double attack"],
//
// Also, if you want to get "fire" and "spark" when you get "heal", do the following settings.
// ["heel", ["fire"]],
// ["heel", ["spark"]],
// ["fire"],
// ["spark"],
skillTreeDerivative: {
    "Sword skill": [
        ["Strong Attack", ["Dual Attack"]],
        ["Slash", ["Dual Attack"]],
        ["Willpower", ["First Aid"]],
        ["Dual Attack", ["Maiden’s Stance"]],
        ["First Aid", ["Spin Crash"]],
        ["Maiden’s Stance", ["Spin Crash"]],
        ["Spin Crash"],
    ],

    "Martial arts": [
        ["Sweep", ["Roundhouse Kick"]],
        ["Qigong", ["Tiger Dance"]],
        ["Roundhouse Kick", ["Tiger Dance"]],
        ["Tiger Dance"],
    ],

    "Attack magic": [
        ["Fire Ⅰ", ["Fire Ⅱ", "Flame Ⅰ"]],
        ["Fire Ⅱ", ["Fire Ⅲ", "Flame Ⅱ"]],
        ["Flame Ⅰ", ["Flame Ⅱ"]],
        ["Fire Ⅲ", ["Flame Ⅲ"]],
        ["Flame Ⅱ", ["Flame Ⅲ"]],
        ["Flame Ⅲ", ["Nuke Ⅰ"]],

        ["Ice Ⅰ", ["Ice Ⅱ", "Blizzard Ⅰ"]],
        ["Ice Ⅱ", ["Ice Ⅲ", "Blizzard Ⅱ"]],
        ["Blizzard Ⅰ", ["Blizzard Ⅱ"]],
        ["Ice Ⅲ", ["Blizzard Ⅲ"]],
        ["Blizzard Ⅱ", ["Blizzard Ⅲ"]],
        ["Blizzard Ⅲ", ["Nuke Ⅰ"]],

        ["Thunder Ⅰ", ["Thunder Ⅱ", "Spark Ⅰ"]],
        ["Thunder Ⅱ", ["Thunder Ⅲ", "Spark Ⅱ"]],
        ["Spark Ⅰ", ["Spark Ⅱ"]],
        ["Thunder Ⅲ", ["Spark Ⅲ"]],
        ["Spark Ⅱ", ["Spark Ⅲ"]],
        ["Spark Ⅲ", ["Nuke Ⅰ"]],

        ["Nuke Ⅰ", ["Nuke Ⅱ"]],
        ["Nuke Ⅱ"],
    ],

    "Recovery magic": [
        ["Cure Ⅰ", ["Cure Ⅱ"]],
        ["Cure Ⅱ", ["Cure Ⅲ"]],
        ["Cure Ⅲ", ["Raise Ⅰ"]],

        ["Heal Ⅰ", ["Heal Ⅱ", "Recover Ⅰ"]],
        ["Heal Ⅱ", ["Heal Ⅲ"]],
        ["Recover Ⅰ", ["Recover Ⅱ"]],
        ["Heal Ⅲ", ["Recover Ⅲ"]],
        ["Recover Ⅱ", ["Recover Ⅲ"]],

        ["Raise Ⅰ", ["Raise Ⅱ"]],
        ["Recover Ⅲ", ["Raise Ⅱ"]],
        ["Raise Ⅱ"],
    ],
},

// To obtain SP by leveling up, set the SP value obtained for each level in the following format.
// [ classId: occupation ID, default: default value, level: SP value, level: SP value }, ... ]
// In the example below, you will get 3SP at Level 2, 4SP at Level 3, and 5SP at all other levels.
levelUpGainSp: [
    {
        classId: 1,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 2,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 3,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 4,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 5,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 6,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 7,
        default: 5,
        2: 3,
        3: 4,
    },

    {
        classId: 8,
        default: 5,
        2: 3,
        3: 4,
    },
]
// =============================================================
// ●This is the end of setting items.
// =============================================================
};
};
