# Ryhmän sisäiset käytännöt

## Työaika

9:30 - 15:30, 6h / päivä
Daily Scrum 10:00
Jos myöhästyy Daily Scrumista niin merkataan ylös. *Rangaistus valitaan myöhemmin*

## Workflow

### Mitä on tapahtunut?

- Katso [Tiimin slack](https://musiikinteoria-mooc.slack.com/messages/CJA3CNJ0J/)
- Katso [Backend + Asiakas slack](https://testmysummer.slack.com/messages/CJM2J1DK6/)
- Katso Product Backlog
- Katso [Mergetyt Pull Requestit](https://github.com/rage/musiikin-teoria-material/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aclosed)

### Aloita työskentely

- **Ota kortti ja merkitse se itsellesi** taululla, siirrä se *In Progress* kohtaan
- Koodaa + git
- [Branch käytännöt](https://github.com/rage/musiikin-teoria-material/new/master#branch-k%C3%A4yt%C3%A4nn%C3%B6t)

### Task valmis tarkistettavaksi

- `git push origin branch` commitit
  - `task` -branch
- Tee PR ja Pyydä Review
  - Review tekijä kirjoittaa *kun kerkeää*, jos review estää työskentelyn jatkamisen (!!) käy vetämässä hihasta.
- Laita task kohtaan *Review*
  - **Kirjoita työtuntien määrä korttiin**
- Kirjoita uusia kortteja
  - *After finishing a task you'll probably notice something that should/could be done next.. Now is a great time to write them down for other to see*
  - *Write notes on card comments can also be very useful.*

### Story valmis

- Laske taskeista työmäärä ja kirjoita se story korttiin
- Aseta story valmiiksi

### Koodikatselmointi

- Mene staging ympäristöön kokeilemaan toimiiko varsinainen uusi toiminallisuus tai bugi korjaus oikein.
  - `User committed 4 hours ago jälkeen on keltainen ympyrä` jossa on linkki stagingiin jossa on uusin commit tietylle haaralle. 
- Katso koodien eroa tarkasti läpi ja yritä ymmärtää mitä muutoksissa on tapahtunut
  - Jos ei ymmmärrä jotain, niin kommentti suoraan pull requestiin. 
- Kun kaikki ylhäällä on tehty voi vasta hyväksyä pull requestin ja sen jälkeen piirrä taululle vihreä check mark taskin viereen.
- Merge käytäntö
  - Kun pull request on hyväksytty, sen tekijä tekee merge branchin ja siihen liittyvän commit viestin muotoon `[Merge] commit viesti (#xx)`

### Lopetat työskentelyn

- `git push` commitit
  - `task` -branch
- Merkkaa tunnit työaikakirjanpitoon sekä korttiin jota olet työstänyt

## Definition of Done

- Ohjelmakoodi laadukasta ja tarvittaessa refaktoroitu
- Ohjelmakoodi on master-branchillä
  - Käyttäjätarina on viety staging-palvelomelle
- Ohjelmakoodi on testattu automaattisesti
- Ohjelmakoodin on katselmoinut joku toinen henkilö (PR Review)

## Branch käytännöt

### Viikolla 0:

`master` sisältää koodin jonka voi viedä tuotantoon, ei sisällä keskeneräisiä taskeja
`development` trunk-based-development branch, joka mergetään masteriin kun se on toimiva, kaikki pushaa tänne.

### Myöhemmin

Kun aloitat taskin tee uusi branch `master` -branchistä
```
git checkout master
git pull
git branch <task-branch>
git checkout <task-branch>
```
