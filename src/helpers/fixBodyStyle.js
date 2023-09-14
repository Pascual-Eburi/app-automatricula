

export default function SetBodyStyle( location ){
    const body = document.body;
    if (!body){ return }

    const classes = Array.from(body.classList);
    classes.forEach(c =>{ body.classList.remove(c)})

    if (location.includes('login')) {
        body.classList.add('app-blank');
    
    }else{
        body.classList.add('app-default');
    }


}