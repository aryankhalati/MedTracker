const calculateDaysRemaining = (quantity, dosesPerDay, startDate) => {
    const totalDaysSupply = Math.floor(quantity / dosesPerDay);

    const start = new Date(startDate);
    const today = new Date();

    const daysElapsed = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    const daysRemaining = totalDaysSupply - daysElapsed;

    return Math.max(daysRemaining, 0);
};

module.exports = calculateDaysRemaining;