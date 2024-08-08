const getBookingDate = (dst: string | Date, ded: string | Date): string[] => {
    const start_date = new Date(dst);
    const end_date = new Date(ded)
    let date = new Date(start_date.getTime());

    const dates:string[] =[];

        while (date <= end_date) {
            const day = date.getDate();
            const month  = date.getMonth() + 1;
            const year = date.getFullYear();
            const dateFormatted = [month , day , year].join("/");
            dates.push(dateFormatted);
            date.setDate(date.getDate()+ 1);
        }
        return dates;
}
export default getBookingDate;