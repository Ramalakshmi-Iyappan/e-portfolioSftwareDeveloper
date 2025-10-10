function isPrime(n) {
  if (n <= 1) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const limit = Math.sqrt(n);
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }

  return true;
}

onmessage = function(event) {
  const num = parseInt(event.data);

  if (isNaN(num)) {
    postMessage('Invalid number.');
    return;
  }

  const result = isPrime(num)
    ? `${num} is a prime number.`
    : `${num} is not a prime number.`;

  postMessage(result);
};
