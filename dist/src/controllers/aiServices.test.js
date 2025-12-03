"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// aiService.test.ts
const aiServices_1 = require("./aiServices");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Test data
const mockChatHistory = [
    {
        id: "badge_1",
        content: {
            type: "ai_text",
            text: "Hello! I'm Anna, your BC skilled trades career counselor. What trade are you interested in exploring?",
        },
    },
    {
        id: "badge_2",
        content: {
            type: "user_text",
            text: "I want to be an electrician",
        },
    },
    {
        id: "badge_3",
        content: {
            type: "ai_text",
            text: "Great choice! Let's explore the electrician trade. Are you ready to move on to the apprenticeship stage?",
        },
    },
    {
        id: "badge_4",
        content: {
            type: "user_text",
            text: "Yes, I'm ready!",
        },
    },
];
// Test suite
async function runTests() {
    console.log("🧪 Starting AiService Tests...\n");
    // Test 1: Initialize Career Path
    console.log("📋 Test 1: Initialize Career Path");
    try {
        const checkpoints = await aiServices_1.aiService.initializeCareerPath("electrician");
        console.log("✅ Success! Checkpoints:", checkpoints);
        console.log(`   Total stages: ${checkpoints.length}`);
        console.assert(Array.isArray(checkpoints), "Checkpoints should be an array");
        console.assert(checkpoints.length > 0, "Should have at least one checkpoint");
    }
    catch (error) {
        console.error("❌ Failed:", error);
    }
    console.log("\n---\n");
    // Test 2: Check Progression Question (Positive Case)
    console.log("📋 Test 2: Check Progression Question - Should be TRUE");
    try {
        const result = await aiServices_1.aiService.checkNextPoint("Yes, I'm ready!", "Are you ready to move on to the apprenticeship stage?");
        console.log("✅ Result:", result);
        console.assert(result.isProgressionQuestion === true, "Should detect progression question");
        console.assert(result.isReady === true, "Should detect user is ready");
    }
    catch (error) {
        console.error("❌ Failed:", error);
    }
    console.log("\n---\n");
    // Test 3: Check Progression Question (Negative Case)
    console.log("📋 Test 3: Check Progression Question - Should be FALSE");
    try {
        const result = await aiServices_1.aiService.checkNextPoint("What tools do electricians use?", "Electricians use various tools like multimeters and wire strippers.");
        console.log("✅ Result:", result);
        console.assert(result.isProgressionQuestion === false, "Should NOT detect progression question");
        console.assert(result.isReady === false, "isReady should be false when not a progression question");
    }
    catch (error) {
        console.error("❌ Failed:", error);
    }
    console.log("\n---\n");
    // Test 4: User Not Ready
    console.log("📋 Test 4: User Not Ready for Progression");
    try {
        const result = await aiServices_1.aiService.checkNextPoint("Not yet, I have more questions", "Should we continue to the next stage?");
        console.log("✅ Result:", result);
        console.assert(result.isProgressionQuestion === true, "Should detect progression question");
        console.assert(result.isReady === false, "Should detect user is NOT ready");
    }
    catch (error) {
        console.error("❌ Failed:", error);
    }
    console.log("\n---\n");
    // Test 5: Different Trade Paths
    console.log("📋 Test 5: Different Trade Career Paths");
    const trades = ["plumber", "carpenter", "welder"];
    for (const trade of trades) {
        try {
            const checkpoints = await aiServices_1.aiService.initializeCareerPath(trade);
            console.log(`✅ ${trade} checkpoints:`, checkpoints.slice(0, 5), "...");
        }
        catch (error) {
            console.error(`❌ Failed for ${trade}:`, error);
        }
    }
    console.log("\n---\n");
    //   // Test 6: Full AI Response Flow
    //   console.log("📋 Test 6: Full AI Response Flow");
    //   try {
    //     // Note: This will call handleProgression internally but won't return anything
    //     // You might want to modify aiResponse to return the result
    //     await aiService.aiReponse("Yes, I'm ready!", mockChatHistory);
    //     console.log("✅ AI Response processed successfully");
    //   } catch (error) {
    //     console.error("❌ Failed:", error);
    //   }
    //   console.log("\n---\n");
    //   // Test 7: Edge Cases
    //   console.log("📋 Test 7: Edge Cases");
    //   // Empty chat history
    //   try {
    //     await aiService.aiReponse("Hello", []);
    //     console.log("❌ Should have failed with empty chat history");
    //   } catch (error) {
    //     console.log("✅ Correctly handled empty chat history error");
    //   }
    // Ambiguous user response
    try {
        const result = await aiServices_1.aiService.checkNextPoint("Maybe... I think so?", "Are you ready to advance to the next level?");
        console.log("✅ Ambiguous response result:", result);
    }
    catch (error) {
        console.error("❌ Failed:", error);
    }
    console.log("\n🎉 Tests Complete!");
}
// Run the tests
runTests().catch(console.error);
