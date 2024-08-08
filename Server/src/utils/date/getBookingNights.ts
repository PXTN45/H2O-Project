const getBookingNights = (start_date: string | Date, end_date: string | Date): number => {
    const dateStart = new Date(start_date)
    const dateEnd = new Date(end_date)

    const differenceInTime = dateEnd.getTime() - dateStart.getTime();
    const differenceInDays = differenceInTime / (100 * 3600 * 24);
    return differenceInDays
}
export default getBookingNights;