FROM mazzolino/armhf-ubuntu:14.04
#FROM ubuntu:14.04

MAINTAINER Jostein Austvik Jacobsen

WORKDIR /home/root/

CMD ["echo", "hello"]
CMD ["sleep", "1"]
CMD ["echo", "."]
CMD ["sleep", "1"]
CMD ["echo", "."]
CMD ["sleep", "1"]
CMD ["echo", "."]
CMD ["sleep", "1"]
CMD ["echo", "world"]
CMD ["sleep", "5"]
