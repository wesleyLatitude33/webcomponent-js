class myMenu extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open'});
        const position = this.getAttribute('position');
        const size = this.getAttribute('size');
        console.log(this.getAttributeNames(0));
        this.setDetailMenu(position, size, shadow);
        this.getMyComponent('http://localhost:8080/compMenu/menu.html', shadow);
        this.getMyMenuOptions('http://localhost:8080/compMenu/menu.json', shadow);
        
    }

    getMyComponent(component, shadow) {

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
    

    getMyMenuOptions(json, shadow) {
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

    setDetailMenu(position, size, shadow){
        const vStyle = document.createElement('style');
        
        if (position === 'horizontal'){
            vStyle.textContent = `
                .menu li{
                    display: inline;
                    float: left;
                }
                .menu li ul{position:absolute; top:40px; background-color: DarkGray; display:none;}
            `;
        } else {
            vStyle.textContent = `
                .menu{
                    width: ${size};
                }
                .menu li ul{position:absolute; margin-top: -40px; margin-left:${size}; background-color: DarkGray; display:none;}
                .menu li:hover ul, .menu li.over ul{display:block;}
            `;
        }   
        vStyle.append(`
            .menu ul{
                margin: 16px 0;
                padding: 0;
                background-color: gray;
                overflow: hidden;
            }
            .menu li a {
                display: block;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
            }
            .menu li a:hover{
                background-color: black;
            }
            .menu li.active{
                background-color: black;
            }
        `)
        shadow.appendChild(vStyle);
    }
}

customElements.define('my-menu', myMenu);


