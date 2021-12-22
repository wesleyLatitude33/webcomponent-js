class myMenu extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open'});
        const position = this.getAttribute('position');
        const size = this.getAttribute('size');
        console.log(this.getAttributeNames(0));
        setDetailMenu(position, size, shadow);
        getMyComponent('http://localhost:8080/compMenu/menu.html', shadow);
        getMyMenuOptions('http://localhost:8080/compMenu/menu.json', shadow);
        
    }
}

customElements.define('my-menu', myMenu);

function getMyComponent(component, shadow) {

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let cont = document.createElement('div');
            cont.innerHTML = this.responseText;
            shadow.appendChild(cont);
        }
    }
    xhttp.open('GET', component, true);
    xhttp.send();
}

function getMyMenuOptions(json, shadow) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200){
            const menu =  shadow.querySelector('ul');
            let menuJson = JSON.parse(this.responseText);
            menuJson.forEach(element => {
                let item = document.createElement('li');
                item.innerHTML = `<a href='${element.link}'>${element.name}</a>`;
                menu.appendChild(item);
                if (element.submenu.length > 0){
                    let subItem = document.createElement('ul');
                    element.submenu.forEach(sub => {
                        let sitem = document.createElement('li');
                        sitem.innerHTML = `<a href='${sub.sublink}'>${sub.submenu}</a>`;
                        subItem.appendChild(sitem);
                    })
                    item.appendChild(subItem);
                }
            });
        }
    }
    xhttp.open('GET', json, true);
    xhttp.send();
}

function setDetailMenu(position, size, shadow){
    const vStyle = document.createElement('style');
    vStyle.textContent = `
        .menu{
            width: ${size};
        }
        .menu li ul{position:absolute; margin-top: -40px; margin-left:${size}; background-color: DarkGray; display:none;}
        .menu li:hover ul, .menu li.over ul{display:block;}
    `;
    if (position === 'horizontal'){
        vStyle.textContent = `
            .menu li{
                display: inline;
                float: left;
            }
            .menu li ul{position:absolute; top:40px; background-color: DarkGray; display:none;}
        `;
    }
    shadow.appendChild(vStyle);
}