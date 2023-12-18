
export function get(photo,loggedUser){
    let userTile = "<div style='margin-top:.5rem;'></div>";
    if(loggedUser.Id != photo.Owner.Id){
        userTile = `
        <div class="dutile">
            <img src="${photo.Owner.Avatar}">
            <span>${photo.Owner.Name}</span>
        </div>
        <hr>
        `;
    }

    let likeIconClass = "fa-regular fa-thumbs-up";
    if(photo.likedByMe){
        likeIconClass = "fa-solid fa-thumbs-up";
    }
    let likeId = "";
    photo.likes.forEach(element => {
        if(element.Owner.Id == loggedUser.Id){
            likeId = element.Id;
        }
    });
    return `
    <div class="mcontainer">
    ${userTile}
    <h4 class="htitle">${photo.Title}</h4>
    <img class="ximage" src="${photo.Image}" >
    <br>
    <span class="pLike" title="${photo.likedBy != undefined ? photo.likedBy : ""}" >${photo.likesCount != undefined? photo.likesCount : "0"}
     <i lbmId="${likeId}" likedByMe="${photo.likedByMe}" id="clickLike" class="${likeIconClass}"></i> </span>
    <span class="mdate">${convertToFrenchDate(photo.Date*1000)}</span>
    <p>${photo.Description}</p>
    </div>
    `;
}

export function loadScript(){
    $("#content").append(`
    <style>
    .fa-thumbs-up{
        cursor:pointer;
    }
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
            border-radius:5px;
            object-fit: cover;
            width:100%;
            padding:1em;
        }
        .mcontainer{
            margin-left:.5rem;
            margin-right:.5rem;
        }
        .mdate{
            color:var(--blike);
        }
        .pLike{
            float:right;
            color:var(--blike);
        }
    </style>
    `);
}