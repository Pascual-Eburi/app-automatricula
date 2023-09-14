import { API_URL } from "../routers/Api";


const DEFAULT_USER_AVATAR = "../../assets/media/avatars/default.png";

export function UserAvatarUrl(photo){
    return photo ? `${API_URL}/${photo}` : DEFAULT_USER_AVATAR
}