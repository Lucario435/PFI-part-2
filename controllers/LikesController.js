import Authorizations from '../authorizations.js';
import Repository from '../models/repository.js';
import PhotoModel from '../models/photo.js';
import PhotoLikeModel from '../models/PhotoLikeModel.js';
import Controller from './Controller.js';

export default
    class Likes extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new PhotoLikeModel()), Authorizations.user());
        this.photoRes = new Repository(new PhotoModel());
    }


    get(photoid){
        //this.HttpContext
        //this.repository;

        // let photo = this.photoRes.get(photoid);
        let all = this.repository.getAll();
        let likes = [];
        all.forEach(element => {
            if(element.PhotoId == photoid){
                likes.push(element);
            }
        });
        console.log("PHOTOID: "+ photoid);
        this.HttpContext.response.JSON(likes);
    }
}