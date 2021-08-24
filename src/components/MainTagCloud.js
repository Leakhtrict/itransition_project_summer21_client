import { TagCloud } from 'react-tagcloud';
import { useHistory } from "react-router-dom";

export default function MainTagCloud({
    data
}) {
    let history = useHistory();

    return (
        <TagCloud
            minSize={18}
            maxSize={18}
            tags={data}
            disableRandomColor={true}
            randomNumberGenerator={() => {return 0}}
            onClick={tag => {history.push(`/byTag/${tag.value}`)}}
        />
    );
}
