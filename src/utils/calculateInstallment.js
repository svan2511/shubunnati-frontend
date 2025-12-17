export function calculateInstallment(disbAmount, tenor) {
  const a = Number(disbAmount);
  const b = Number(tenor);

  if (a && b) {
    const principle = a / b;

    let intrst = 0;

    switch (b) {
      case 15:
        intrst = a * 0.015833;
        break;

      case 18:
        intrst = a * 0.016444;
        break;

      case 22:
        intrst = a === 150000 ? a * 0.012212 : a * 0.016545;
        break;

      case 24:
        intrst = a * 0.01833;
        break;

      default:
        intrst = 0;
    }

    return Math.ceil(principle + intrst);
  }

  return "";
}
