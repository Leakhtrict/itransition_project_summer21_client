import { TagCloud } from 'react-tagcloud';
import { useHistory } from "react-router-dom";
import { Grid, Container } from "@material-ui/core";

export default function MainTagCloud({
    data
}) {
    let history = useHistory();

    return (
        <Container maxWidth="xs" style={{ marginBottom: "8px" }}>
            <TagCloud
                minSize={18}
                maxSize={18}
                tags={data}
                disableRandomColor={true}
                randomNumberGenerator={() => {return 0}}
                onClick={tag => {history.push(`/byTag/${tag.value}`)}}
                renderer={(tag) => {
                    return (
                        <div item key={tag.value} className="itemTag" style={{ margin: "6px", display: "inline-block" }}>{"#" + tag.value}</div>
                    )
                }}
            />
        </Container>
    );
}
