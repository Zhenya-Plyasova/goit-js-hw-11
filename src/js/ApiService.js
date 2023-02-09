export default class ApiService {
    constructor(){
        this.searchQuery = "";
        this.page = 1;
    }

    async fetchImages(query){
            const response = await axios
            .get(`${URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    
            return response.data.hits;
    
    };
}

