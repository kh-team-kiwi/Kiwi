package kh.kiwi.test.logging;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class Logs {
	private static final Logger logger = LogManager.getLogger(Logs.class);

    public void myMethod() {
        logger.info("This is an info message");
        logger.error("This is an error message");
    }
}
