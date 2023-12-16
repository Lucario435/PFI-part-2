

export function get(photoList,userdatas,loggedUser){
    let buildstr = "";
    photoList.forEach(element => {
        buildstr += getTilePhoto(element,userdatas,loggedUser);
    });
    return buildstr;
}

function getTilePhoto(photo,userdatas,loggedUser){
    let accdata = userdatas[photo.OwnerId];
    let ownerActions = photo.OwnerId != loggedUser.Id ? "" : 
    `
        <div class="pOwnerActions" photoId="${photo.Id}">
        <i class="fa fa-pencil" id="editPhotoCmd"> </i>
        <i class="fa fa-trash" id="deletePhotoCmd"> </i>
        </div>
    `;
    return `
    <div class="tphoto" photoId="${photo.Id}">
        ${ownerActions}
        <span class="pTitle">${photo.Title}</span>
        <div class="photoContainer">
            ${photo.Shared == undefined? "": `
            <img class="pShared pIcon" src="././images/shared.png">
            `}
            <img class="pOwner pIcon" src="${accdata.Avatar}">
            <img class="pImg" src="${photo.Image}">
        </div>
        <span class="pLike"> </span>
        <span class="pDate">${convertToFrenchDate(photo.Date)}</span>
    </div>
    `;
}

export function loadScript(renderPhotoDetail){
    $(".photoContainer").on("click",function(){
        let balise = $(this);
        let pid = balise.parent().attr("photoId")
        // console.log(pid);
        renderPhotoDetail(pid);
    })
    

    $("#content").append($(`
    <style>
        .pImg{
            width:100%;
        }
        .pOwnerActions{
            float:right;
        }
        .tphoto{
            width:250px;
            height:150px;
            color:blue;
            margin-left:.5rem;
            margin-right:.5rem;
        }
        .pTitle{
            font-weight:bold;
        }
        .photoContainer{
            position:relative;
            display:inline-block;
            cursor:pointer;
        }
        .pOwner{
            width:3rem;
            border-radius:100%;
            float:left;
            top:.5rem;
            left:.5rem;
            position:absolute;
        }
        .pShared{
            width:3rem;
            border-radius:100%;
            float:left;
            top:.5rem;
            left:4rem;
            position:absolute;
        }
        .pIcon{
            background-color: rgba(255, 255, 255, 0.5);
            outline:solid 2px white;
        }
        .pLike{

        }
        .pDate{
            width:100%;
            font-size:.8rem;
        }
    </style>
    
    `));
}