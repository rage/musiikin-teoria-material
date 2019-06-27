---
path: "/ohjeet"
hidden: false
information_page: true
banner: true
---


# Ohjeet

## Partiaalit

Partiaali | Kuvaus
-- | --
`<music-sheet>` | Lisää materiaalin keskelle nuotiston
`<music-exercise>` | Lisää materiaaliin tehtävän
`<piano>` | Lisää materiaalin keskelle pianon kuvan

## Music Sheet

Music Sheet käyttää abc-notaatiota nuottien piirtämiseen.

- [Lisää abc notaatiosta](http://abcnotation.com/learn)

Partiaalille voi antaa parametreja. Alempana on esimerkkejä niiden käytöstä

Parametri | Sopivat arvot | Selitys
-- | -- | --
`onlysound` | `true`/`false` | Näyttää ainoastaan play-napin materiaalissa
`onlynotes`| `true`/`false` | Näyttää ainoastaan nuotiston materiaalissa
`notation` | abc-notaatiota | Mitä nuotteja kirjoitetaan. `notation` sijoitetaan `<music-sheet>` tagin sisälle

### Esimerkkejä

<music-sheet>T:Intervalleja
L:1/1
"1"[C C] "2"[C D] "3"[C E] "4"[C F] "5"[C G] "6"[C A] "7"[C B] "8"[C c]</music-sheet>

```
<music-sheet>T:Intervalleja
L:1/1
"1"[C C] "2"[C D] "3"[C E] "4"[C F] "5"[C G] "6"[C A] "7"[C B] "8"[C c]</music-sheet>
```

<music-sheet>L:1/4
c/2 d/2 ^d2 | g2 ^g2 ^g ^f2 ^d | ^A/2 c/2 d2 | f2 ^f2</music-sheet>

```
<music-sheet>L:1/4
c/2 d/2 ^d2 | g2 ^g2 ^g ^f2 ^d | ^A/2 c/2 d2 | f2 ^f2</music-sheet>
```

<music-sheet onlynotes=true>L:1/1
[c e g]</music-sheet>

```
<music-sheet onlynotes=true>L:1/1
[c e g]</music-sheet>
```

<music-sheet onlysound=true>L:1/1
[c e g]</music-sheet>

```
<music-sheet onlysound=true>L:1/1
[c e g]</music-sheet>
```

## Music Exercise

Parametri | Sopivat arvot | Selitys
-- | -- | --
`type` | kts. alta | Tehtävän tyyppi, voi sisältää variaatio-tietoa kuten `piano_`, `_notes` tai `_sound`
`name` | `"jokin teksti"` | Tehtävän nimi, näkyy otsikkona
`description` | `"jokin teksti"` | Tehtävän kuvaus, näkyy otsikon alla
`required` | 1 - ääretön (numero) | Montako kysymystä täytyy saada oikein putkeen tehtäväpisteiden saamiseksi. Jos ei anneta, on 10.
`quizid` | quizzes id (UUID) | Määrittää quizzes id:n, eli mihin tehtävän vastaukset tallennetaan tietokannassa. Saadaan quizzes palvelusta.

### Esimerkkejä

> Ota huomioon että tehtävillä ei välttämättä ole `quizid` paramteria, jolloin niiden tietoja ei voi ladata tietokannasta.

<music-exercise></music-exercise>

```
<music-exercise></music-exercise>
```

----

<music-exercise type="piano_scales_sound" name="Esimerkki piano kuuntelutehtävästä"></music-exercise>

```
<music-exercise type="piano_scales_sound" name="Esimerkki piano kuuntelutehtävästä"></music-exercise>
```

----

<music-exercise type="intervals" name="Esimerkki" description="Tältä näyttää kuvaus, tälle tehtävälle on kovakoodattu quizid, jonka voi korvata quizid parametrilla." required=5></music-exercise>

```
<music-exercise type="intervals" name="Esimerkki" description="Tältä näyttää kuvaus, tälle tehtävälle on
kovakoodattu quizid, jonka voi korvata quizid parametrilla." required=5></music-exercise>
```

## Piano

Parametri | Sopivat arvot | Selitys
-- | -- | --
`notes` | Esim `"0 1 2 3 4"` | String jossa numeroita 0-23 välilyönnillä erotettuina esim `0`=C1, `12`=C2, `23`=H2
`playable` | `true`/`false` | Sallii pianon soittamisen hiirellä jos `notes` parametria ei anneta.

### Esimerkkejä

<piano notes="0 12 23"></piano>

```
<piano notes="0 12 23"></piano>
```

C-asteikko

<piano notes="0 2 4 5 7 9 11"></piano>

```
C-asteikko

<piano notes="0 2 4 5 7 9 11"></piano>
```

<piano notes="0 1 2 3 4"></piano>

```
<piano notes="0 1 2 3 4"></piano>
```

<piano playable=true></piano>

```
<piano playable=true></piano>
```
