# Regex Linker

They idea is that you can provide multiple regex to logseq and whenever you type something which matches that regex, the text gets replaces with something else.

Original inspiration was that i wanted to replace jira ticket ids with the links to that ticket. Eg if i type in "PROJ-1234", it will automatically create a link to
http://jira-cloud-whatever.com/id/PROJ-1234

## Example config

(escape \ via \\ in the regex)

    {
        "(PROJ-[0-9]*)\\s": "[$1](http://cloud-jira-whatever.com/id/$1) "
    }