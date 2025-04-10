package edu.mtisw.kartingrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class kartingrmBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(kartingrmBackendApplication.class, args);
	}
}

/*
2025-04-09T23:38:49.078-04:00  INFO 7468 --- [nio-8090-exec-1] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring DispatcherServlet 'dispatcherServlet'
2025-04-09T23:38:49.078-04:00  INFO 7468 --- [nio-8090-exec-1] o.s.web.servlet.DispatcherServlet        : Initializing Servlet 'dispatcherServlet'
2025-04-09T23:38:49.078-04:00  INFO 7468 --- [nio-8090-exec-1] o.s.web.servlet.DispatcherServlet        : Completed initialization in 0 ms
2025-04-09T23:42:21.589-04:00  INFO 7468 --- [io-8090-exec-10] o.apache.coyote.http11.Http11Processor   : Error parsing HTTP request header
 Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level.

java.lang.IllegalArgumentException: Invalid character found in method name [0x160x030x010x060xf20x010x000x060xee0x030x030xba#0x12{0xf10xade,'0x960xfb0x81]^0x8e0x950xafjz0xce0xc5yp[Ma4s0xed0xb00x120x98 ]. HTTP method names must be tokens
	at org.apache.coyote.http11.Http11InputBuffer.parseRequestLine(Http11InputBuffer.java:407) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:264) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:896) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1744) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at java.base/java.lang.Thread.run(Thread.java:840) ~[na:na]

2025-04-09T23:42:21.589-04:00  INFO 7468 --- [nio-8090-exec-9] o.apache.coyote.http11.Http11Processor   : Error parsing HTTP request header
 Note: further occurrences of HTTP request parsing errors will be logged at DEBUG level.

java.lang.IllegalArgumentException: Invalid character found in method name [0x160x030x010x060xd20x010x000x060xce0x030x03O0x1a20xb98(0xb4<0x0c0x960xac0x890xb50x030xce90x8bcJ0xb30x1d0x930xe6JI@0x0e0xcb0x820x8c0xc10x90 ]. HTTP method names must be tokens
	at org.apache.coyote.http11.Http11InputBuffer.parseRequestLine(Http11InputBuffer.java:407) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:264) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:63) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:896) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1744) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:52) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1191) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:659) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61) ~[tomcat-embed-core-10.1.18.jar:10.1.18]
	at java.base/java.lang.Thread.run(Thread.java:840) ~[na:na]


*/