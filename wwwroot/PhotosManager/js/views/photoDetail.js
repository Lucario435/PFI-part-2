
export function get(photo,loggedUser){
    let userTile = "";
    if(loggedUser.Id == photo.Owner.Id){
        userTile = `
        <div class="dutile">
        <img src="${photo.Owner.Avatar}">
        <span>${photo.Owner.Name}</span>
        </div>
        <hr>
        `;
    }
    return `
    <div class="mcontainer">
    ${userTile}
    <h4 class="htitle">${photo.Title}</h4>
    <img class="ximage" src="${photo.Image}" >

    </div>
    `;
}

export function loadScript(){
    $("#content").append(`
    <style>
    .dutile{
        margin-top:.5rem;
        display:block;
        grid-template-columns:3rem auto;
    }
    .dutile>img{
        height:3rem;
        width:3rem;
        margin-right:.5rem;
        border-radius:100%;
    }
    .dutile>span{
        font-weight:bold;
        font-size:1.2rem;
    }
        .htitle{
            font-weight:bold;
            font-size:1.5rem;
        }
        .ximage{
            height:auto;
            max-width:100%;
        }
        .mcontainer{
            margin-left:.5rem;
            margin-right:.5rem;
        }
    </style>
    `);
}