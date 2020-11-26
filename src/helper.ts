export const isToday = (date: string): boolean => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const todayString = today.toJSON().slice(0, 10) + 'UTC'
    return date === todayString
}