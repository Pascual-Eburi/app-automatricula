
/**
 * 
 * @param {*} dateTime 
 * @returns 
 */
export function ExtractDateTime( dateTime ){
    if (!dateTime){ return {}}
    const dateObj = new Date( dateTime );

    const date = dateObj.toISOString().substr(0, 10);
    const time = dateObj.toISOString().substr(11, 8);

    return {
        date: date,
        time: time
    }
}

export function FormatDateToSpanish( date ) {
    if (!date){ return ''}
    const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const parts = date.split('-') || date.split('/');
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    
    return `${day} de ${months[month - 1]}, ${year}`;

      
}

export function toScheduleDate(dateString) {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const weekDays = [
      'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'
    ];
  
    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
  
    const weekDayIndex = date.getDay();
    const weekDay = weekDays[weekDayIndex];
  
    return { weekDay, date: day, month };
  

  }
  