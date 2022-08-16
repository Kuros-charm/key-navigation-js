




function addEvent(e){
    events.push(e);
    e.element.addEventListener(...e.args)
}

events = events.filter(e => {
    e.element.removeEventListener(...e.args);
    return false
})

addEvent({
    element:document,
    args: ['keydown', (e)=>{
        
        let current;
        if (!e.code.includes('Arrow')){
            return;
        }
        const isUpDown = ['ArrowDown', 'ArrowUp'].includes(e.code);
        const nextTarget = [...document.querySelectorAll('input')].map(element => {
            return {
                element,
                rect: element.getBoundingClientRect()
            }
          
        }).filter(t => {
            if (t.element === e.target){
                current = t;
                return false;
            }
            return true;
        }).filter(t => {
            if (!current){
                return false;
            }
            return true;
        }).filter(t => {
            if (e.code === 'ArrowDown'){
                return t.rect.top > current.rect.bottom;
            }
            if (e.code === 'ArrowUp'){
                return current.rect.top > t.rect.bottom;
            }
            if (e.code === 'ArrowRight'){
                return t.rect.left > current.rect.right;
            }
             if (e.code === 'ArrowLeft'){
                return current.rect.left > t.rect.right;
            }
            return false;
        }).map(t => {
            // closest distance between two box
            const dx = Math.max(current.rect.left - t.rect.right, 0, t.rect.left - current.rect.right);
            const dy = Math.max(current.rect.top - t.rect.bottom, 0, t.rect.top - current.rect.bottom);
            return {
                ...t,
                sortingValues:[
                                isUpDown ? dx: dy,
                                isUpDown ? dy: dx,
                                // tie breaker, distance between center of box
                                  Math.abs(current.rect.left + current.rect.right -  t.rect.left - t.rect.right) +
                                   Math.abs(current.rect.top + current.rect.bottom -  t.rect.top - t.rect.bottom)
                              ]
            }
        }).reduce((currT, t) => {
            t.element.setAttribute('ddebug', t.sortingValues[0])
            if (!currT){
                return t;
            }
            let sortValue = 0;
            currT.sortingValues.forEach((ctsv, i) => {
                let newSv = (ctsv - t.sortingValues[i]);
                if (Math.abs(newSv) <  3){ // buffer for case like border
                    newSv = 0
                }
                sortValue = sortValue || newSv // find first sv compared not to 0, so result will sort by sortingValues[0], then sortingValues[1], etc.
            });

            if (sortValue < 0){
                return currT;
            }
            return t;
        }, null);

        if (nextTarget){
            nextTarget.element.focus();
            e.preventDefault();
            e.stopImmediatePropagation();
        }



        
    },true]
})

