const getBookingNights = (start_date: string | Date, end_date: string | Date): number => {
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)

    const differenceInTime = endDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (100 * 3600 * 24);
    return differenceInDays
}
export default getBookingNights;