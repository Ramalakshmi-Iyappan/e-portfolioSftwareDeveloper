const result = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (value === "C") {
      result.value = "";
    } else if (value === "←") {
      result.value = result.value.slice(0, -1);
    } else if (value === "=") {
      try {
        result.value = eval(result.value) || "";
      } catch {
        result.value = "Error";
      }
    } else {
      result.value += value;
    }
  });
});
