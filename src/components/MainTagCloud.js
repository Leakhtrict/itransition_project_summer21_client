import { TagCloud } from 'react-tagcloud';
import { useHistory } from "react-router-dom";
import { Container } from "@material-ui/core";

export default function MainTagCloud({
    data
}) {
    let history = useHistory();

    return (
        <Container maxWidth="xs" style={{ margin: "8px 0px", borderTop: "solid 1px black", borderBottom: "solid 1px black" }}>
            <TagCloud
                minSize={18}
                maxSize={18}
                tags={data.slice(0, 12)}
                disableRandomColor={true}
                randomNumberGenerator={() => {return 0}}
                onClick={tag => {history.push(`/byTag/${tag.value}`)}}
                renderer={(tag) => {
                    return (
                        <div key={tag.value} className="itemTag" style={{ margin: "6px", display: "inline-block" }}>{"#" + tag.value}</div>
                    )
                }}
            />
        </Container>
    );
}
