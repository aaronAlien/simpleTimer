const readline = require("readline");
const { start } = require("repl");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// interval
let currentInterval;

function startTimer(duration, taskType, reminder = "") {
  const total = duration * 60 * 1000; // depending on user input
  const end = Date.now() + total;

  // Start interval
  currentInterval = setInterval(() => {
    const timeRemaining = end - Date.now();

    if (timeRemaining <= 0) {
      clearInterval(currentInterval); // Stop the timer

      // Handle task-specific transitions
      if (taskType === "work") {
        console.log("\nWork session complete! \nTake a break. :) \n");
        rl.question(
          "\n\nWould you like to set a timer for your break? (y/n): ",
          (answer) => {
            if (answer.toLowerCase() === "y") {
              startBreak();
            } else {
              mainMenu();
            }
          }
        );
      } else if (taskType === "break") {
        console.log("\n\nBreak finished! Let's get back to work... \n");
        rl.question("Would you like to set a timer? (y/n): ", (answer) => {
          if (answer.toLowerCase() === "y") {
            startBreak();
          } else {
            mainMenu();
          }
        });
      } else if (taskType === "reminder") {
        console.log(`REMINDER: \n\n${reminder} !! \n`);
        mainMenu();
      }
    }
  }, 1000);

  console.log(
    "\nTimer started!\n...\n\nType 'MAIN' to cancel.\nType 'CHECK' to see time remaining."
  );

  // Prevent duplicate listeners
  rl.removeAllListeners("line");

  // cancel and time remaining check
  rl.on("line", (input) => {
    const choice = input.toLowerCase();
    const timeRemaining = end - Date.now();
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    if (choice === "main") {
      rl.question("Cancel timer? (y/n): ", (response) => {
        if (response.toLowerCase() === "y") {
          console.log("\n\nTIMER CANCELLED. \n\n");
          clearInterval(currentInterval);
          setTimeout(() => {
            mainMenu();
          }, 1500);
        } else {
          console.log(
            `Continuing timer. ${minutes} minutes ${seconds} seconds...`
          );
        }
      });
    } else if (choice === "check") {
      console.log(`Time remaining: ${minutes} minutes ${seconds} seconds...`);
    }
  });
}

// work
function startWork() {
  rl.question("Enter work duration (minutes): ", (duration) => {
    if (isNaN(duration) || duration <= 0) {
      console.log("Invalid Input");
      setTimeout(startWork, 1000);
    } else startTimer(duration, "work");
  });
}

// break
function startBreak() {
  rl.question("Enter break duration (minutes): ", (duration) => {
    if (isNaN(duration) || duration <= 0) {
      console.log("Invalid Input");
      setTimeout(startBreak, 1000);
    } else {
      startTimer(duration, "break");
    }
  });
}

// reminder
function startReminder() {
  rl.question("Enter reminder details: ", (reminder) => {
    rl.question("Enter timer duration (minutes): ", (duration) => {
      if (isNaN(duration) || duration <= 0) {
        console.log("Invalid Input");
        setTimeout(startReminder, 1000);
      } else {
        startTimer(duration, "reminder", reminder);
      }
    });
  });
}

// main menu switch

function mainMenu() {
  rl.question(
    "\n\nChoose a task type...\n" +
      "1. Work\n" +
      "2. Break\n" +
      "3. Reminder\n" +
      "4. Exit Program\n",
    (answer) => {
      switch (answer) {
        case "1":
          startWork();
          break;
        case "2":
          startBreak();
          break;
        case "3":
          startReminder();
          break;
        case "4":
          rl.close();
          break;
        default:
          console.log("Invalid option. Please try again...");
          setTimeout(() => {
            mainMenu();
          }, 1500);
          break;
      }
    }
  );
}

mainMenu();
