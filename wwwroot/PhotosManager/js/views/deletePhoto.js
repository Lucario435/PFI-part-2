
export function get(photo){
    return `
    <span class="htitle">Voulez-vous vraiment effacer cette photo?</span>
    
    <div class="bform">
    <br>
    
    <div class="bformData">
    <span class="b">${photo.Title}</span>
    <img class="ix" src="${photo.Image}">
    </div>
    </div>
    <form class="form" id="formCPhoto">
        <input type='submit' name='submit' id='deletePhotoOKCmd' value="Effacer la photo" class="form-control btn-danger">
    </form>
    <div class="cancel">
    <button type="button" class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>;
    `;
}
export function loadScript(){
    $("#content").append(`
    <style>
        #content{
            text-align:center;
        }
        .bformData{
            display:flex;
            flex-direction: column;
            align-items: center;
            text-align:center;
        }
        .htitle{
            font-weight:bold;
            font-size:1.3rem;
            text-align:center;
        }
        .b{
            color:var(--blike);
        }
        .ix{
            border-radius:5px;
            width:50%;
        }
    </style>
    `)
}