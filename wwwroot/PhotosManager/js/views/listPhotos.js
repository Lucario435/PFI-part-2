

export function get(photoList,userdatas,loggedUser){
    let buildstr = "<div class='bigContainer'>";
    photoList.forEach(element => {
        if(element.Shared == false && element.OwnerId != loggedUser.Id)
        {
        } else buildstr += getTilePhoto(element,userdatas,loggedUser);
        
    });
    buildstr += "</div>"
    return buildstr;
}

function getTilePhoto(photo,userdatas,loggedUser){
    let accdata = userdatas[photo.OwnerId];
    let ownerActions = (photo.OwnerId != loggedUser.Id) && (loggedUser.isAdmin == false) ? "" : 
    `
        <div class="pOwnerActions" photoId="${photo.Id}">
        <i class="fa fa-pencil" id="editPhotoCmd"> </i>
        <i class="fa fa-trash" id="deletePhotoCmd"> </i>
        </div>
        
    `;//<script>alert("${photo.Date}")</script>
    return `
    <div class="tphoto" photoId="${photo.Id}">
        ${ownerActions}
        <span class="pTitle">${photo.Title}</span>
        <div class="photoContainer">
            ${photo.Shared == false || photo.OwnerId != loggedUser.Id ? "": `
            <img class="pShared pIcon" src="././images/shared.png">
            `}
            <img class="pOwner pIcon" src="${accdata.Avatar}">
            <img class="pImg" src="${photo.Image}">
        </div>
        <span class="pLike">${photo.likesCount != undefined? photo.likesCount : "0"} <i class="fa-regular fa-thumbs-up"></i> </span>
        <span class="pDate">${convertToFrenchDate(photo.Date*1000)}</span>
    </div>
    `;
}

export function loadScript(renderPhotoDetail,renderDeletePhoto,renderEditPhoto){
    $(".photoContainer").on("click",function(){
        let balise = $(this);
        let pid = balise.parent().attr("photoId")
        // console.log(pid);
        renderPhotoDetail(pid);
    })

    $("#content").append($(`
    <style>
        .bigContainer{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            /*justify-content: center;*/
          
        }
        .pImg{
            width:100%;
            height:100%;
            object-fit: cover;
        }
        .pOwnerActions{
            float:right;
        }
        .tphoto{
            width:250px;
            height:250px;
            color:var(--blike);
            margin-bottom:4rem;
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
            height:100%;
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
            float:right;
        }
        .pDate{
            width:100%;
            font-size:.8rem;
        }
    </style>
    
    `));
}