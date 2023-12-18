

export function get(photoList,userdatas,loggedUser,CurrentFilter){
    let buildstr = `<div class="bigContainer">`;
    //fonction pour filtrer
    switch(CurrentFilter)
    {
        //Trier par date de création
        case "date":
            //filtrage
            photoList.sort((a, b) => new Date(b.Date) - new Date(a.Date));
            break;

        //Trier par créateur
        case "creator":
            //filtrage
            photoList.sort((a, b) => a.OwnerName.localeCompare(b.OwnerName));
            break;

        //Trier plus aimées
        case "like":
            //filtrage
            photoList.sort((a, b) => b.likes - a.likes);
            break;

        //Mes photos
        case "own":
            //filtrage
            let newList = [];
            photoList.forEach(element => {
                //vérifier si owner
                if(element.OwnerName == loggedUser.Name)
                {
                    newList.push(element);
                }
            });
            photoList = newList;
            break;
    }

    //Affichage
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
        <p class="pTitle">${photo.Title}</p>
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
            border-radius:5px;
        }
        .pOwnerActions{
            float:right;
        }
        .fa-pencil{
            cursor:pointer;
        }
        .fa-trash{
            cursor:pointer;
        }
        .tphoto{
            /*width:250px;*/
            height:250px;
            color:var(--blike);
            margin-bottom:4rem;
            width:100%;
            color:rgb(0, 87, 204);
            margin-left:.5rem;
            margin-right:.5rem;
            border-radius:5px;
            box-shadow: 0 5px 10px #0003;
            padding:1em;
        }
        .pgrid{
            margin:1em;
            position: relative;
            display: grid;
            grid-template-columns: repeat(auto-fill,minmax(300px,1fr));
            grid-gap: 1em;
            justify-content: center;
        }
        .pTitle{
            font-weight:bold;
            color:rgb(0, 87, 204);
        }
        .photoContainer{
            position:relative;
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
            color:rgb(0, 87, 204);
        }
        .pDate{
            width:100%;
            font-size:.8rem;
            color:rgb(0, 87, 204);
        }
    </style>
    
    `));
}