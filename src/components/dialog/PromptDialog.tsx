import { FC } from "react";
import { Button, ButtonGroup, Dialog, DialogContent, DialogTitle } from "@mui/material";

export const PromptDialog: FC<{
    title?: string,
    text: string,
    onClose: () => void,
    open?: boolean,
}> = (args) => {

    return (
        <Dialog open={args.open ?? false} onClose={args.onClose} PaperProps={{style: { backgroundColor: "antiquewhite"}}}>
            {args.title !== undefined && <DialogTitle align={"center"}>
                {args.title}
            </DialogTitle>}
            <DialogContent>
                <span>
                    {args.text}
                </span>
                <ButtonGroup fullWidth={true}>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        onClick={args.onClose}
                    >
                        Ok
                    </Button>
                </ButtonGroup>
            </DialogContent>
        </Dialog>
    )
}
