import {Avatar, ListItemIcon, ListItemText, MenuItem, Select} from "@mui/material";
import Image from "next/image";
import * as React from "react";
import {styled} from "@mui/material/styles";
import {useRouter} from "next/router";
import Link from "next/link"

const Root = styled(Select)({
    '.MuiOutlinedInput-notchedOutline': {
        border: 'none'
    }
})

const languages = [
    {
        code: 'en',
        label: 'English',
    },
    {
        code: 'sv',
        label: 'Swedish',
    },
] as const

export const LanguageSelect = () => {

    const {locale} = useRouter()

    const currentLanguage = languages.find(l => l.code === locale) ?? 'en'

    return (
            <Root
                labelId="language-select-label"
                id="language-select"
                value={currentLanguage}
                label="Language"
                autoWidth
                renderValue={(selected) => (
                    <LanguageMenuItem lang={selected}/>
                )}
            >
                {languages.map(lang => <LanguageMenuItem lang={lang}/>)}
            </Root>
    )
}

const LanguageMenuItem = ({lang}: { lang: any }) => (
    <Link href="#" locale={lang.code}>
        <MenuItem>
            <ListItemIcon>
                <Avatar sx={{width: '1.5rem', height: '1.5rem'}}>
                    <Image key={lang.code} src={`/locale/${lang.code}.svg`} layout='fill'/>
                </Avatar>
            </ListItemIcon>
            <ListItemText>{lang.label}</ListItemText>
        </MenuItem>
    </Link>
)