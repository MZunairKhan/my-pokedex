import CONSTANTS from "../App.Constants";
import PokemonListItem from "../Models/PokemonListItem";

const StorageService =  {

    addData(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    addListData(newData: PokemonListItem[]) {
        const currentData: PokemonListItem[] = this.getData(CONSTANTS.STORAGE.NORMAL_LIST) || [];

        if (!this.isDataAlreadyAdded(currentData,newData) ) {
            const list = [...currentData, ...newData];
            localStorage.setItem(CONSTANTS.STORAGE.NORMAL_LIST, JSON.stringify(list));
            localStorage.setItem(CONSTANTS.STORAGE.OFFSET, JSON.stringify(list.length));
        }
    },

    getData(key: string) {
        const currentDataString: string = localStorage.getItem(key) as string;
        let currentData = null;

        if (currentDataString) {
            currentData = JSON.parse(currentDataString);
        }

        return currentData;
    },

    isDataAlreadyAdded(currentData: PokemonListItem[], newData: PokemonListItem[]) {
        return newData[newData.length - 1].name === currentData[currentData.length - 1]?.name;
    }
}

export default StorageService;
