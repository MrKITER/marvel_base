import { useState } from "react";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";

import decoration from '../../resources/img/vision.png';
import ErrorBounder from "../errorBounder/ErrorBounder";

const App = () => {

    const [selectedCharId, setSelectedCharId] = useState(null);

    const onUpdateChar = (id) => {
        setSelectedCharId(id);
    }

    return (
        <div className="app">
            <AppHeader/>
            <main>
                <ErrorBounder>
                    <RandomChar/>
                </ErrorBounder>
                <div className="char__content">
                    <ErrorBounder>
                        <CharList onUpdateChar={onUpdateChar}/>
                    </ErrorBounder>
                    <ErrorBounder>
                        <CharInfo charId={selectedCharId}/>
                    </ErrorBounder>
                </div>
                <img className="bg-decoration" src={decoration} alt="vision"/>
            </main>
        </div>
    )
}

export default App;