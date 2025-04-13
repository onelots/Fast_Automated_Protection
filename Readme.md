# Fast Automated Protection

## Contexte du projet : 

    - Vous travaillez pour une startup qui vend des prestations de sauvegardes à des clients.
    - A ce titre vous allez créer une infrastructure sécurisée de sauvegardes réseau.
(P.R)

## fonctionnement des sauvegardes

L'équipe technique attribue directement une URL au client, par exemple "http://client1.sauvegarde.fr" puis le client arrive directement sur sa page de connexion grâce au reverse proxy, qui, placé juste devant le serveur web, lui attribue une IP. Depuis l'espace utilisateur, le client peut voir l'état de ses sauvegardes, le stockage restant et les différentes informations relatives à son compte.Dans une zone isolée de l'extérieur on a trois choses :     
    - Panel admin : accessible que par les techniciens via Wireguard 
    - BDD générale : deux authentifications auront lieu ( 1 quand le client va vouloir se connecter à son compte et la deuxième quand en SSH l'authentification pour lancer les sauvegardes aura lieue)
    - Un docker.sock : Allumage des dockers

Il nous reste donc une partie à couvrir, les SAUVERGARDES.

Le script RUN, selon le temps qu'aura défini l'utilisateur, se lance.

- nouveau client = nouvelle stack docker bdd / panel 
- api clients ou admins 
- séparation des backends (admin pas atteignable)


## Architecture réseau

Ci-dessous l'infrastructure que nous avons imaginée pour mener à bien le projet :

![Architecture_projet](image.webp)

## Connaissances nécessaires

    - Utilisation de Docker
    - Python

## options



## Backend Admin

Dans le backend admin on retrouve :
    - Une base de données générale, qui va checker si le mot de passe admin du client est identique à celui renseigner et qui contient également la liste des clients et les "stats" des clients (capacitée de stockage autorisée).

    - Le fichier docker.sock qui sert à allumer des dockers

    - Le pannel d'aministration qui est utilisé par les administrateurs systèmes l'ensemble des clients et s'assurer que tout fonctionne correctement. 

## Notification

A développer

## sauvegardes chiffrées

A développer

## Alerte

A développer

## récupération des sauvegardes

A développer

