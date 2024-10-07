const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// work
function startWork() {
  rl.question("Enter work duration (minutes): ", (duration) => {
    startTimer(duration, "work");
  });
}

// break
function startBreak() {
  rl.question("Enter break duration (minutes): ", (duration) => {
    startTimer(duration, "break");
  });
}

// reminder
function startReminder() {
  rl.question("Enter reminder details: ", (reminder) => {
    rl.question("Enter timer duration (minutes): ", (duration) => {
      startTimer(duration, "reminder", reminder);
    });
  });
}

// timer
function startTimer(duration, taskType, reminder = "") {
  const total = duration * 60 * 1000;
  const end = Date.now() + total;

  // cancel - add time remaining check
  console.log("\nTimer started!\n...\n\nType 'MAIN' to cancel.\nType 'CHECK' to see time remaining.");

// task switch 
  const currentInterval = setInterval(() => {
    const timeRemaining = end - Date.now();
    if (timeRemaining <= 0) {
      clearInterval(currentInterval);
      switch (taskType) {
        case "work":
          console.log("Timer finished. Take a break! :)");
          rl.question(
            "Would you like to set a timer for your break? (y/n): ",
            (answer) => {
              if (answer === "y" || answer === "Y") {
                startBreak();
              } else {
                mainMenu();
              }
            }
          );
          break;
        case "break":
          console.log("Break finished! Lets get back to work...");
          rl.question("Would you like to set a timer? (y/n): ", (answer) => {
            if (answer === "y" || answer === "Y") {
              startWork();
            } else {
              mainMenu();
            }
          });
          break;
        case "reminder":
          console.log(`REMINDER: \n${reminder} !!`);
          rl.close();
          break;
      }
    }
  }, 1000);

  // cancel and time remaining check
  rl.on("line", (input) => {

    const timeRemaining = end - Date.now();
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    if (input === "MAIN" || input === "main") {

      rl.question("Cancel timer? (y/n): ", (response) => {
        if (response === "y" || response === "Y") {
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
    }
    if (input === "CHECK" || input === "check") {
      console.log(`Time remaining: ${minutes} minutes ${seconds} seconds...`);
    }
  });
}

// main menu switch

function mainMenu() {
  rl.question(
    "Choose a task type...\n" +
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
