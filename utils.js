export function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    const date = day + month + year;

    return date;
}

export function compareTodayDate(inputDate) {
    // Convert date string to Date object
    const date = new Date(
      parseInt(inputDate.substr(4, 4)), // Year
      parseInt(inputDate.substr(2, 2)) - 1, // Month (zero-based)
      parseInt(inputDate.substr(0, 2)) // Day
    );
    
    // Get current date
    const today = new Date();
    
    // Compare dates
    if (date < today) {
      return false;
    }

    return true;
}