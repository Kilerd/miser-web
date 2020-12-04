import dayjs from 'dayjs';

export const isToday = (date: string): boolean => {
    const today = dayjs().format('YYYY-MM-DD');
    return today === date;
}