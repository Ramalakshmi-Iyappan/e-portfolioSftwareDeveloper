const choices = ["rock", "paper", "scissors"];

document.querySelectorAll(".choice").forEach(button => {
  button.addEventListener("click", () => {
    const userChoice = button.dataset.choice;
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    document.getElementById("user-choice").textContent = `You chose: ${userChoice}`;
    document.getElementById("computer-choice").textContent = `Computer chose: ${computerChoice}`;

    let result = "It's a tie!";
    if (
      (userChoice === "rock" && computerChoice === "scissors") ||
      (userChoice === "paper" && computerChoice === "rock") ||
      (userChoice === "scissors" && computerChoice === "paper")
    ) {
      result = "You win! 🎉";
    } else if (userChoice !== computerChoice) {
      result = "You lose! 😢";
    }

    document.getElementById("winner").textContent = `Result: ${result}`;
  });
});
